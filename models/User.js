import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 2,
      max: 20,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    imagePath: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      required: true,
      min: 5,
      unique: true,
    },
    lastLogin: String,
    location: String,
    role: {
      type: String,
      required: true,
      min: 5,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
