import mongoose from "mongoose";

const DeleteRequestSchema = new mongoose.Schema(
  {
    requestedProduct: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
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
      },
    ],
  },
  { timestamps: true }
);

const DeleteRequest = mongoose.model("DeleteRequest", DeleteRequestSchema);
export default DeleteRequest;
