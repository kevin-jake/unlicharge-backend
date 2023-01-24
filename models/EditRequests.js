import mongoose, { Schema } from "mongoose";

const EditRequestSchema = new mongoose.Schema(
  {
    requestedProduct: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Battery", "BMS", "ActiveBalancer"],
      required: true,
    },
    newSpecs: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category",
    },
    status: {
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
    requestor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      body: {
        type: String,
        min: 2,
        max: 240,
      },
    },
  },
  { timestamps: true }
);

const EditRequest = mongoose.model("EditRequest", EditRequestSchema);
export default EditRequest;
