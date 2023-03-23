import mongoose, { Schema } from "mongoose";

const DeleteRequestSchema = new mongoose.Schema(
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
    requestor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    deleteReason: {
      type: String,
      required: true,
      min: 2,
      max: 240,
    },
    status: {
      type: String,
      required: true,
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

const DeleteRequest = mongoose.model("DeleteRequest", DeleteRequestSchema);
export default DeleteRequest;
