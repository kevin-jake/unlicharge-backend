import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import moment from "moment-timezone";
import multer, { memoryStorage } from "multer";

import authRoutes from "./routes/auth.js";
import requestRoutes from "./routes/requests.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";

import { getImage } from "./middleware/s3.js";
import { uploadImage } from "./controllers/imageHandling.js";

import User from "./models/User.js";
import Product from "./models/Product.js";
import Battery from "./models/specsModel/Battery.js";
import BMS from "./models/specsModel/BMS.js";
import ActiveBalancer from "./models/specsModel/ActiveBalancer.js";
import EditRequest from "./models/EditRequests.js";
import DeleteRequest from "./models/DeleteRequests.js";
import {
  activeBalancerSpecs,
  batterySpecs,
  bmsSpecs,
  deleteRequests,
  editRequests,
  products,
  users,
} from "./data/index.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

moment.tz.setDefault("Asia/Manila");
app.enable("trust proxy");
app.use(
  morgan(
    ':remote-addr - :remote-user - :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {
      stream: {
        write: function (message) {
          process.stdout.write(`[${moment().format()}]` + " " + message);
        },
      },
    }
  )
);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// TODO: Improve image uploads
/* FILE STORAGE */
const storage = memoryStorage();
const upload = multer({ storage });

// Images handling
app.post("/image", upload.single("imagePath"), uploadImage);
app.get("/image/:key(*)", getImage);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/profile", userRoutes);
app.use("/requests", requestRoutes);
app.use("/products", productRoutes);

// Table Cleanup function
async function clearCollections() {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
    })
  );
}

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then((res) => {
    console.log("🧮 Mongodb connected at: " + res.connection.host);
    app.listen(PORT);
    console.log(`🚀 Server ready at ${process.env.API_URL}`);

    // Uncomment the following lines to delete the tables
    // clearCollections();

    // Adding the dummy data
    // User.insertMany(users);
    // Battery.insertMany(batterySpecs);
    // BMS.insertMany(bmsSpecs);
    // ActiveBalancer.insertMany(activeBalancerSpecs);
    // Product.insertMany(products);
    // EditRequest.insertMany(editRequests);
    // DeleteRequest.insertMany(deleteRequests);
  })
  .catch((err) => {
    console.log(err);
  });
