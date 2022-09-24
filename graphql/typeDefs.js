const { gql } = require("apollo-server-express");

module.exports = gql`
  # Global Schema
  type DeleteRequest {
    id: ID!
    requestor: User!
    reason: String!
    status: String!
    createdAt: String!
    updatedAt: String
  }

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
    creator: User!
    updatedAt: String
    approved_by: User!
    new_data_from: ID
    previous_data: BattPreviousData
    edit_request: [BattEditRequest!]
    delete_request: [DeleteRequest!]
  }
  type BattPreviousData {
    name: String!
    type: String!
    model: String!
    min_voltage: String
    max_voltage: String
    nominal_voltage: String!
    price_per_pc: String!
    supplier: String
    editor: String!
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
    requestor: User!
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
    getBatteries(userId: ID): [Battery]
    getBattery(battId: ID!): Battery
  }
  type Mutation {
    # User mutations
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!

    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!

    # Battery Mutations
    createBattery(batteryInput: BatteryInput!): Battery!
    editBattery(battId: ID!, batteryInput: BatteryInput!): Battery!
    deleteBattery(battId: ID!, reason: String!): Battery

    # Requests Mutations
    approveRequest(
      operation: String
      partsListId: ID!
      requestId: ID
      table: String!
    ): Battery
  }
  type Subscription {
    newPost: Post!
  }
`;
