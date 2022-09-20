const { model, Schema } = require("mongoose");

const abSchema = new Schema({
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

module.exports = model("Active_balancer", abSchema);
