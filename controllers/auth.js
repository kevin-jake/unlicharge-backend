import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  const {
    userName,
    firstName,
    lastName,
    email,
    password,
    imagePath,
    mobileNumber,
    location,
    occupation,
  } = req.body;

  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email, userName: userName });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User or Email exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();

  const newUser = new User({
    userName,
    firstName,
    lastName,
    email,
    password: passwordHash,
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
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log("Signup Success");

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    userName: newUser.userName,
    token: token,
  });
};

/* LOGGING IN */
const login = async (req, res, next) => {
  const { email, userName, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email, userName: userName });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        userName: existingUser.userName,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  console.log("Login Success");
  console.log(existingUser);
  const response = {
    userId: existingUser.id,
    email: existingUser.email,
    userName: existingUser.userName,
    role: existingUser.role,
    token: token,
  };
  console.log(response);
  res.json(response);
};
