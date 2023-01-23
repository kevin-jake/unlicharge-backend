import mongoose, { Schema } from "mongoose";

const BMSSchema = new mongoose.Schema(
  {
    battType: {
      type: String,
      default: "",
    },
    strings: {
      type: Number,
      required: true,
      min: 2,
      max: 4,
    },
    chargeCurrent: {
      type: Number,
      required: true,
      min: 2,
      max: 4,
    },
    dischargeCurrent: {
      type: Number,
      required: true,
      min: 2,
      max: 4,
    },
    voltage: {
      type: Number,
      min: 2,
      max: 4,
    },
    portType: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
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
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const BMS = mongoose.model("BMS", BMSSchema);
export default BMS;
