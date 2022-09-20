const { model, Schema } = require("mongoose");

const bmsSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String },
  strings: { type: String, required: true },
  charge_current: { type: String, required: true },
  discharge_current: { type: String, required: true },
  port_type: { type: String },
  voltage: { type: String },
  price: { type: String, required: true },
  supplier: { type: String, required: true },
  publish_status: {
    type: String,
    enum: ["Request", "Approved", "Removed", "Verified"],
    required: true,
  },
  createdAt: { type: String, required: true },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("BMS", bmsSchema);
