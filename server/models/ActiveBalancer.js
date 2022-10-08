const { model, Schema } = require("mongoose");

const editSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String },
  strings: { type: String, required: true },
  balance_current: { type: String },
  balancing: {
    type: String,
    enum: ["Active", "Passive"],
    required: true,
  },
  price: { type: String, required: true },
  supplier: { type: String },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String },
});

const abSchema = new Schema({
  // Specs model
  name: { type: String, required: true },
  brand: { type: String },
  strings: { type: String, required: true },
  balance_current: { type: String },
  balancing: {
    type: String,
    enum: ["Active", "Passive"],
    required: true,
  },
  price: { type: String, required: true },
  supplier: { type: String, required: true },
  image_url: { type: String },

  // Data details
  publish_status: {
    type: String,
    enum: ["Request", "Approved", "Removed", "Verified"],
    required: true,
  },
  createdAt: { type: String, required: true },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: { type: String },
  new_data_from: {
    type: Schema.Types.ObjectId,
    refPath: "edit_request",
  },
  approved_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  // Requests
  edit_request: [editSchema],
  delete_request: [
    {
      reason: { type: String, required: true },
      requestor: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: { type: String, required: true },
      createdAt: { type: String, required: true },
      updatedAt: { type: String },
    },
  ],

  // Previous data
  previous_data: {
    name: { type: String, required: true },
    brand: { type: String },
    strings: { type: String, required: true },
    balance_current: { type: String },
    balancing: {
      type: String,
      enum: ["Active", "Passive"],
      required: true,
    },
    price: { type: String, required: true },
    supplier: { type: String, required: true },

    editor: { type: String },
  },
});

module.exports = model("Active_balancer", abSchema);
