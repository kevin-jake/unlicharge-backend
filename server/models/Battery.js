const { model, Schema } = require("mongoose");

const batterySchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Lead Acid", "Li-on", "LiFePo4"],
    required: true,
  },
  model: { type: String, required: true },
  min_voltage: { type: String },
  max_voltage: { type: String },
  nominal_voltage: { type: String, required: true },
  capacity: { type: String, required: true },
  price_per_pc: { type: String, required: true },
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

module.exports = model("Battery", batterySchema);
