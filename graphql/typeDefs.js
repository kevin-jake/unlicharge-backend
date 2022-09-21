const { gql } = require("apollo-server-express");

module.exports = gql`
  # User graphql model or schema
  type User {
    id: ID!
    username: String!
    email: String!
    mobile_number: String!
    createdAt: String!
    last_login: String!
    signed_using: String!
    address: String!
    token: String
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String
    email: String!
    mobile_number: String!
    signed_using: String
    address: String!
  }

  # Parts list related graphql model or schema
  ## Battery
  type Battery {
    id: ID!
    name: String!
    type: String!
    model: String!
    min_voltage: String
    max_voltage: String
    nominal_voltage: String!
    price_per_pc: String!
    supplier: String
    publish_status: String!
    createdAt: String!
    creator: Creator!
    updatedAt: String
    new_data_from: ID
    edit_request: [BattEditRequest!]
    delete_request: [DeleteRequest!]
  }
  type Creator {
    id: ID!
    username: String!
    email: String!
    last_login: String!
  }
  type BattEditRequest {
    id: ID!
    name: String!
    type: String!
    model: String!
    min_voltage: String
    max_voltage: String
    nominal_voltage: String!
    price_per_pc: String!
    supplier: String
    requestor: Creator!
    status: String!
    createdAt: String!
    updatedAt: String
  }
  type DeleteRequest {
    id: ID!
    requestor: Creator!
    reason: String!
    status: String!
    createdAt: String!
    updatedAt: String
  }
  input BatteryInput {
    name: String!
    type: String!
    model: String!
    nominal_voltage: String!
    capacity: String!
    price_per_pc: String!
    min_voltage: String
    max_voltage: String
    supplier: String
  }

  # Posts related graphql model or schema
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  # Root Query, Mutation and Subscription
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUsers(username: String!): [User]
    getBatteries(publish_status: String): [Battery]
    getBattery(battId: ID!): Battery
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    createBattery(batteryInput: BatteryInput!): Battery!
    editBattery(battId: ID!, batteryInput: BatteryInput!): Battery!
    deleteBattery(battId: ID!, reason: String!): Battery
  }
  type Subscription {
    newPost: Post!
  }
`;
