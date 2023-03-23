import mongoose, { Schema } from "mongoose";

const EditRequestSchema = new mongoose.Schema(
  {
    requestedProduct: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
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
    requestor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        body: {
          type: String,
          min: 2,
          max: 240,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const EditRequest = mongoose.model("EditRequest", EditRequestSchema);
export default EditRequest;
