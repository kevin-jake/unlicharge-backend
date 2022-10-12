const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const express = require("express");
const http = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers/index");
const { graphqlUploadExpress } = require("graphql-upload");
const passport = require("passport");
var FacebookStrategy = require("passport-facebook");
const { facebookOptions, facebookCallback } = require("../util/fb-login");
const { uuid } = require("uuidv4");
const session = require("express-session");

// TODO: Add login or register via Facebook and Google
// TODO: Add upload images
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  const app = express();

  app.use(
    session({
      genid: (req) => uuid(),
      secret: SESSION_SECRECT,
      resave: false,
      saveUninitialized: false,
    })
  );
  // TODO: Add login or register via Facebook and Google
  passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "http://localhost:3000/",
      failureRedirect: "http://localhost:3000/",
    })
  );

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    path: "/",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: ({ req }) => ({ req }),
  });

  // More required logic for integrating with Express
  await server.start();

  app.use(graphqlUploadExpress({ maxFileSize: MAX_FILE_SIZE, maxFiles: 10 }));
  server.applyMiddleware({ app, path: "/" });

  // Modified server startup
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  return server;
}

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("🧮 Mongodb connected at: " + res.connection.host);
    return startApolloServer(typeDefs, resolvers);
  })
  .then((res) => {
    console.log(
      `🚀 Server ready at ${process.env.APP_URL}:${process.env.PORT}${res.graphqlPath}`
    );
  });
