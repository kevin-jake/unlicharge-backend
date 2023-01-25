import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import moment from "moment-timezone";

/* REGISTER USER */
export const register = async (req, res, next) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    imagePath,
    mobileNumber,
    location,
    occupation,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    error.status = 422;
    console.log(err);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username },
        { mobileNumber: mobileNumber },
      ],
    });
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  if (existingUser) {
    const error = new Error(
      "User, Email or Mobile Number exists already, please login instead."
    );
    error.status = 422;
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new Error("Could not create user, please try again.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();

  const newUser = new User({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    imagePath,
    mobileNumber,
    location,
    occupation,
    role: "User",
    lastLogin: datePh,
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  console.log("[" + datePh + `] New User ${username} (${email}) Registered!`);

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    username: newUser.username,
    token,
  });
};

/* LOGGING IN */
export const login = async (req, res, next) => {
  const { email, username, mobileNumber, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username },
        { mobileNumber: mobileNumber },
      ],
    });
  } catch (err) {
    const error = new Error("Logging in failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  if (!existingUser) {
    const error = new Error("Invalid credentials, could not log you in.");
    error.status = 403;
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new Error(
      "Could not log you in, please check your credentials and try again."
    );
    error.status = 500;
    console.log(err);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new Error("Invalid credentials, could not log you in.");
    error.status = 403;
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
      // FIXME: Change this if going to prod
      // { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Logging in failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }
  const datePh = moment.tz(Date.now(), "Asia/Manila").format();

  console.log(
    "[" +
      datePh +
      `] ${existingUser.username} (${existingUser.email}) Logged In.`
  );
  existingUser.lastLogin = datePh;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new Error("Saving failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  const response = {
    userId: existingUser.id,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    username: existingUser.username,
    imagePath: existingUser.imagePath,
    mobileNumber: existingUser.mobileNumber,
    location: existingUser.location,
    role: existingUser.role,
    occupation: existingUser.occupation,
    token,
  };
  res.json(response);
};
