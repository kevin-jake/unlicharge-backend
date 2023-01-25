import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Battery", "BMS", "ActiveBalancer"],
      required: true,
    },
    specs: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    editor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    arpprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    publishStatus: {
      type: String,
      required: true,
    },
    previousData: {
      type: Schema.Types.ObjectId,
      default: null,
      refPath: "category",
    },
    editRequests: {
      type: [Schema.Types.ObjectId],
      ref: "EditRequest",
      default: [],
    },
    deleteRequests: {
      type: [Schema.Types.ObjectId],
      ref: "DeleteRequest",
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
