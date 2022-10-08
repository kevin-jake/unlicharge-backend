const postResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const requestResolvers = require("./parts_list/requests");
const batteryResolvers = require("./parts_list/battery");
const bmsResolvers = require("./parts_list/bms");
const abResolvers = require("./parts_list/activeBalancer");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...usersResolvers.Query,
    ...postResolvers.Query,
    ...batteryResolvers.Query,
    ...requestResolvers.Query,
    ...bmsResolvers.Query,
    ...abResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...batteryResolvers.Mutation,
    ...requestResolvers.Mutation,
    ...bmsResolvers.Mutation,
    ...abResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
