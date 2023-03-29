import mongoose, { Schema } from "mongoose";

const BatterySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    supplierLink: {
      type: String,
      default: "",
    },
    supplier: {
      type: String,
      default: "",
    },
    battType: {
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
      default: null,
    },
    minVoltage: {
      type: Number,
      default: null,
    },
    internalReisistance: {
      type: Number,
      default: null,
    },
    chargeCRate: {
      type: Number,
      default: null,
    },
    dischargeCRate: {
      type: Number,
      default: null,
    },
    maxDischargeRate: {
      type: Number,
      default: null,
    },
    productId: {
      type: Schema.Types.ObjectId,
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
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Battery = mongoose.model("Battery", BatterySchema);
export default Battery;
