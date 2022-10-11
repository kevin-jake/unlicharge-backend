const { gql } = require("apollo-server-express");

module.exports = gql`
  # Global Schema
  type DeleteRequest {
    id: ID!
    requestor: User!
    reason: String
    status: String!
    createdAt: String!
    updatedAt: String
  }
  scalar Upload

  type FileUploadResponse {
    ETag: String!
    Location: String!
    key: String!
    Key: String!
    Bucket: String!
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
    image_url: String
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
    image_url: String
    publish_status: String!
    createdAt: String!
    creator: User!
    updatedAt: String
    approved_by: User!
    new_data_from: ID
    edit_request: [BattEditRequest!]
    delete_request: [DeleteRequest!]
    previous_data: BattPreviousData
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
    image_url: String
  }

  ## BMS
  type BMS {
    id: ID!
    name: String!
    brand: String
    strings: String!
    charge_current: String!
    discharge_current: String!
    port_type: String
    voltage: String
    price: String!
    supplier: String
    image_url: String
    publish_status: String!
    createdAt: String!
    creator: User!
    updatedAt: String
    approved_by: User!
    new_data_from: ID
    edit_request: [BMSEditRequest!]
    delete_request: [DeleteRequest!]
    previous_data: BMSPreviousData
  }
  type BMSPreviousData {
    id: ID!
    name: String!
    brand: String
    strings: String!
    charge_current: String!
    discharge_current: String!
    port_type: String
    voltage: String
    price: String!
    supplier: String
    editor: String!
  }
  type BMSEditRequest {
    id: ID!
    name: String!
    brand: String
    strings: String!
    charge_current: String!
    discharge_current: String!
    port_type: String
    voltage: String
    price: String!
    supplier: String
    requestor: User!
    status: String!
    createdAt: String!
    updatedAt: String
  }
  input BMSInput {
    name: String!
    brand: String
    strings: String!
    charge_current: String!
    discharge_current: String!
    port_type: String
    voltage: String
    price: String!
    supplier: String
    image_url: String
  }

  ## Active Balancer
  type ActiveBalancer {
    id: ID!
    name: String!
    brand: String
    strings: String!
    balance_current: String
    balancing: String!
    price: String!
    supplier: String
    image_url: String
    publish_status: String!
    createdAt: String!
    creator: User!
    updatedAt: String
    approved_by: User!
    new_data_from: ID
    edit_request: [ABEditRequest!]
    delete_request: [DeleteRequest!]
    previous_data: ABPreviousData
  }
  type ABPreviousData {
    id: ID!
    name: String!
    brand: String
    strings: String!
    balance_current: String
    balancing: String!
    price: String!
    supplier: String
    editor: String!
  }
  type ABEditRequest {
    id: ID!
    name: String!
    brand: String
    strings: String!
    balance_current: String
    balancing: String!
    price: String!
    supplier: String
    requestor: User!
    status: String!
    createdAt: String!
    updatedAt: String
  }
  input ABInput {
    name: String!
    brand: String
    strings: String!
    balance_current: String
    balancing: String!
    price: String!
    supplier: String
    image_url: String
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
    # Posts get queries
    getPosts: [Post]
    getPost(postId: ID!): Post

    # User get queries
    getUsers(username: String!): [User]

    # Requests get queries
    getPartsEditRequests(
      partsListId: String!
      table: String!
      status: String
    ): [BattEditRequest]
    getPartsDeleteRequests(
      partsListId: String!
      table: String!
      status: String
    ): [DeleteRequest]

    # Parts queries
    # Battery get queries
    getBatteries(userId: ID): [Battery]
    getBattery(battId: ID!): Battery

    # BMS get queries
    getBMSes(userId: ID): [BMS]
    getBMS(bmsId: ID!): BMS

    # AB get queries
    getActiveBalancers(userId: ID): [ActiveBalancer]
    getAB(abId: ID!): ActiveBalancer
  }
  type Mutation {
    # User mutations
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!

    # S3 Upload
    uploadFile(file: Upload!): FileUploadResponse

    # Posts mutations
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!

    # Battery Mutations
    createBattery(batteryInput: BatteryInput!): Battery!
    editBattery(battId: ID!, batteryInput: BatteryInput!): Battery!
    deleteBattery(battId: ID!, reason: String!): Battery

    # BMS Mutations
    createBMS(bmsInput: BMSInput!): BMS!
    editBMS(bmsId: ID!, bmsInput: BMSInput!): BMS!
    deleteBMS(bmsId: ID!, reason: String!): BMS

    # Active Balancer Mutations
    createAB(abInput: ABInput!): ActiveBalancer!
    editAB(abId: ID!, abInput: ABInput!): ActiveBalancer!
    deleteAB(abId: ID!, reason: String!): ActiveBalancer

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
