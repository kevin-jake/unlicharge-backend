import mongoose, { Schema } from "mongoose";
import uuid4 from "uuid4";

const productSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid4() },
    name: {
      type: String,
      required: true,
    },
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
      default: "",
      refPath: "category",
    },
    editRequests: {
      type: Array,
      default: [],
    },
    deleteRequests: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
