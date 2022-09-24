const postResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const batteryResolvers = require("./parts_list/battery");
const requestResolvers = require("./parts_list/requests");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...usersResolvers.Query,
    ...postResolvers.Query,
    ...batteryResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...batteryResolvers.Mutation,
    ...requestResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
