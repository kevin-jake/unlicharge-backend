const { model, Schema } = require("mongoose");

const editSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Lead Acid", "Li-on", "LiFePo4"],
    required: true,
  },
  model: { type: String, required: true },
  nominal_voltage: { type: String, required: true },
  capacity: { type: String, required: true },
  price_per_pc: { type: String, required: true },
  min_voltage: { type: String },
  max_voltage: { type: String },
  supplier: { type: String },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String },
});

const batterySchema = new Schema({
  // Specs model
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Lead Acid", "Li-on", "LiFePo4"],
    required: true,
  },
  model: { type: String, required: true },
  nominal_voltage: { type: String, required: true },
  capacity: { type: String, required: true },
  price_per_pc: { type: String, required: true },
  min_voltage: { type: String },
  max_voltage: { type: String },
  supplier: { type: String },
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
    type: {
      type: String,
      enum: ["Lead Acid", "Li-on", "LiFePo4"],
      required: true,
    },
    model: { type: String, required: true },
    nominal_voltage: { type: String, required: true },
    capacity: { type: String, required: true },
    price_per_pc: { type: String, required: true },
    min_voltage: { type: String },
    max_voltage: { type: String },
    supplier: { type: String },
    editor: { type: String },
  },
});
module.exports = model("Battery", batterySchema);
