import mongoose, { Schema } from "mongoose";

const ActiveBalancerSchema = new mongoose.Schema(
  {
    strings: {
      type: Number,
      required: true,
      min: 2,
      max: 4,
    },
    balanceCurrent: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    balancingType: {
      type: String,
      required: true,
      enum: ["Active", "Passive"],
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

const ActiveBalancer = mongoose.model("ActiveBalancer", ActiveBalancerSchema);
export default ActiveBalancer;
