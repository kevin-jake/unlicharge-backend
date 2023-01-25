import mongoose, { Schema } from "mongoose";

const BMSSchema = new mongoose.Schema(
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
      default: "",
    },
    strings: {
      type: Number,
      required: true,
    },
    chargeCurrent: {
      type: Number,
      required: true,
    },
    dischargeCurrent: {
      type: Number,
      required: true,
    },
    voltage: {
      type: Number,
    },
    portType: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
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
      ref: "Product",
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BMS = mongoose.model("BMS", BMSSchema);
export default BMS;
