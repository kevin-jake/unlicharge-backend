import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import { categoryFormat } from "../util/categoryFormat.js";

/* CREATE */
export const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  const status = "Active";
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Status selector for users. If Admin Approve the createProduct else if user have it as request
  let publishStatus;
  if (req.userData.role != "Admin") {
    publishStatus = "Request";
  } else {
    publishStatus = "Approved";
  }

  // Initialize Specs creation
  let newSpec;
  if (category === "Battery") {
    const { nominalVoltage, capacity, pricePerPc, maxVoltage, minVoltage } =
      req.body;
    newSpec = new Battery({
      ...req.body,
      nominalVoltage: +nominalVoltage || 0,
      capacity: +capacity || 0,
      pricePerPc: +pricePerPc || 0,
      maxVoltage: +maxVoltage || 0,
      minVoltage: +minVoltage || 0,
      specCreator: req.userData.userId,
      productId: req.params.id,
      status,
    });
  } else if (category === "BMS") {
    const {
      strings,
      chargeCurrent,
      dischargeCurrent,
      voltage,
      portType,
      price,
    } = req.body;
    newSpec = new BMS({
      ...req.body,
      strings: +strings || 0,
      chargeCurrent: +chargeCurrent || 0,
      dischargeCurrent: +dischargeCurrent || 0,
      voltage: +voltage || 0,
      price: +price || 0,
      portType,
      specCreator: req.userData.userId,
      productId: req.params.id,
      status,
    });
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = req.body;
    newSpec = new ActiveBalancer({
      ...req.body,
      strings: +strings || 0,
      balanceCurrent: +balanceCurrent || 0,
      price: +price || 0,
      balancingType,
      specCreator: req.userData.userId,
      productId: req.params.id,
      status,
    });
  }
  try {
    await newSpec.save();
  } catch (err) {
    const error = new Error(
      `Creating ${category} failed, please try again.`,
      500
    );
    console.log(err);
    return next(error);
  }

  // Creating variable for of new Product
  const createdProduct = new Product({
    category: category,
    specs: newSpec.id,
    publishStatus,
    creator: req.userData.userId,
  });

  // Update Spec table with the new created Product Id.
  newSpec.productId = createdProduct.id;
  try {
    await newSpec.save();
  } catch (err) {
    const error = new Error(
      `Updating ${category} productId failed, please try again.`,
      500
    );
    console.log(err);
    return next(error);
  }

  // Saving of new Product
  try {
    await createdProduct.save();
  } catch (err) {
    const error = new Error("Creating Product failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

/* READ */
export const getProducts = async (req, res, next) => {
  let products;
  const category = categoryFormat(req.params.category);
  let filter = {
    category,
  };
  if (!req.userData) {
    filter = { ...filter, publishStatus: "Approved" };
  } else if (req.userData.role === "User") {
    filter = {
      $or: [
        { ...filter, publishStatus: "Approved" },
        { ...filter, publishStatus: "Request", creator: req.userData.userId },
        { ...filter, publishStatus: "Deleted", creator: req.userData.userId },
      ],
    };
  }

  try {
    products = await Product.find(filter, "-previousData")
      .populate({
        path: "specs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
      .populate({ path: "creator", select: "username imagePath" });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return next(error);
  }

  // console.log("🚀 ~ file: products.js:150 ~ getProducts ~ products:", products);
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

export const getProductById = async (req, res, next) => {
  let product;
  const category = categoryFormat(req.params.category);
  let filter = {
    _id: req.params.id,
    category,
  };
  if (!req.userData) {
    filter = { ...filter, publishStatus: "Approved" };
  } else if (req.userData.role == "User") {
    filter = {
      $or: [
        { ...filter, publishStatus: "Approved" },
        { ...filter, publishStatus: "Request", creator: req.userData.userId },
        { ...filter, publishStatus: "Deleted", creator: req.userData.userId },
      ],
    };
  }

  try {
    product = await Product.findOne(filter)
      .populate({
        path: "specs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
      .populate({ path: "creator", select: "username imagePath" })
      .populate("previousData");
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return next(error);
  }

  res.json({
    product,
  });
};

// TODO: get products sorted or filtered from frontend
