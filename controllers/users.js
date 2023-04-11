import { validationResult } from "express-validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* READ */
// GET Users list
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new Error("Fetching users failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// GET User by ID
export const getUsersById = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(req.params);
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error("Something went wrong, could not find the User.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!user) {
    const error = new Error("Could not find User for the provided uid.");
    console.log(err);
    return res.status(404).json({ message: error.message });
  }

  res.json({ user: user.toObject({ getters: true }) });
};

/* Update user info */
export const updateUserInformation = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    imagePath,
    mobileNumber,
    location,
  } = req.body;
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data." });
  }

  // Check for user data ownership
  if (req.userData.userId !== req.params.profileId) {
    return res
      .status(403)
      .json({ message: "You are not authorize to edit this user." });
  }

  // Check for existing data
  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [
        { email: email, _id: { $ne: req.body.userId } },
        { username: username, _id: { $ne: req.body.userId } },
        { mobileNumber: mobileNumber, _id: { $ne: req.body.userId } },
      ],
    });
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  console.log(
    "🚀 ~ file: users.js:76 ~ updateUserInformation ~ existingUser:",
    existingUser
  );

  if (existingUser) {
    const error = new Error(
      "Username, Email or Mobile Number exists already, please login instead."
    );
    return res.status(422).json({ message: error.message });
  }

  // Saving of updated specs on the table
  let updatedUser = {
    username,
    firstName,
    lastName,
    email,
    password,
    imagePath,
    mobileNumber,
    location,
  };
  let newUser;
  console.log(
    "🚀 ~ file: users.js:91 ~ updateUserInformation ~ updatedUser:",
    updatedUser
  );
  try {
    newUser = await User.findByIdAndUpdate(req.params.profileId, updatedUser, {
      new: true,
    });
  } catch (err) {
    const error = new Error(
      `Updating user information failed, please try again.`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Logging in failed, please try again later.");
    error.status = 500;
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  const response = {
    userId: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    username: newUser.username,
    imagePath: newUser.imagePath,
    mobileNumber: newUser.mobileNumber,
    location: newUser.location,
    role: newUser.role,
    token,
  };

  res.status(201).json(response);
};
