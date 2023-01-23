import mongoose from "mongoose";

const BatterySpecsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    nominalVoltage: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    capacity: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    pricePerPc: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    maxVoltage: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    minVoltage: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
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

const BatterySpecs = mongoose.model("BatterySpecs", BatterySpecsSchema);
export default BatterySpecs;
