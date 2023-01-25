import mongoose, { Schema } from "mongoose";

const ActiveBalancerSchema = new mongoose.Schema(
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
    strings: {
      type: Number,
      required: true,
    },
    balanceCurrent: {
      type: Number,
      required: true,
    },
    balancingType: {
      type: String,
      required: true,
      enum: ["Active", "Passive"],
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

const ActiveBalancer = mongoose.model("ActiveBalancer", ActiveBalancerSchema);
export default ActiveBalancer;
