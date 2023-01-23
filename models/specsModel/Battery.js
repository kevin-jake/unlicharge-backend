import mongoose, { Schema } from "mongoose";

const BatterySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    nominalVoltage: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerPc: {
      type: Number,
      required: true,
    },
    maxVoltage: {
      type: Number,
      required: true,
    },
    minVoltage: {
      type: Number,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "Product",
    },
    specCreator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    editRequest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Battery = mongoose.model("Battery", BatterySchema);
export default Battery;
