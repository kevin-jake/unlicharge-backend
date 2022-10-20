const { model, Schema } = require("mongoose");

const editSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String },
  strings: { type: String, required: true },
  charge_current: { type: String, required: true },
  discharge_current: { type: String, required: true },
  port_type: { type: String },
  voltage: { type: String },
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

const bmsSchema = new Schema(
  {
    // Specs model
    name: { type: String, required: true },
    brand: { type: String },
    strings: { type: String, required: true },
    charge_current: { type: String, required: true },
    discharge_current: { type: String, required: true },
    port_type: { type: String },
    voltage: { type: String },
    price: { type: String, required: true },
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
      default: null,
    },
    approved_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    //Requests
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
      name: { type: String },
      brand: { type: String },
      strings: { type: String },
      charge_current: { type: String },
      discharge_current: { type: String },
      port_type: { type: String },
      voltage: { type: String },
      price: { type: String },
      supplier: { type: String },
      editor: { type: String },
    },
  },
  { minimize: false }
);

module.exports = model("BMS", bmsSchema);
