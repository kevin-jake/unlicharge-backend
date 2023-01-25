import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import { categoryFormat } from "../util/categoryFormat.js";

/* CREATE */
export const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  let publishStatus;
  if (req.userData.role != "Admin") {
    publishStatus = "Request";
  } else {
    publishStatus = "Approved";
  }

  let newSpec;
  const { category, specs } = req.body;

  if (category === "Battery") {
    const { nominalVoltage, capacity, pricePerPc, maxVoltage, minVoltage } =
      specs;
    newSpec = new Battery({
      ...specs,
      nominalVoltage: +nominalVoltage || 0,
      capacity: +capacity || 0,
      pricePerPc: +pricePerPc || 0,
      maxVoltage: +maxVoltage || 0,
      minVoltage: +minVoltage || 0,
      specCreator: req.userData.userId,
      status: "Active",
    });
  } else if (category === "BMS") {
    const {
      strings,
      chargeCurrent,
      dischargeCurrent,
      voltage,
      portType,
      price,
    } = specs;
    newSpec = new BMS({
      ...specs,
      strings: +strings || 0,
      chargeCurrent: +chargeCurrent || 0,
      dischargeCurrent: +dischargeCurrent || 0,
      voltage: +voltage || 0,
      price: +price || 0,
      portType,
      specCreator: req.userData.userId,
      status: "Active",
    });
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = specs;
    newSpec = new ActiveBalancer({
      ...specs,
      strings: +strings || 0,
      balanceCurrent: +balanceCurrent || 0,
      price: +price || 0,
      balancingType,
      specCreator: req.userData.userId,
      status: "Active",
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

  const createdProduct = new Product({
    category,
    specs: newSpec.id,
    publishStatus,
    creator: req.userData.userId,
  });

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
  try {
    products = await Product.find({
      category: category,
      // TODO: Add publishStatus filter
    })
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

  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

export const getProductById = async (req, res, next) => {
  let product;
  const category = categoryFormat(req.params.category);
  try {
    product = await Product.findOne({
      _id: req.params.id,
      category: category,
      // TODO: Add publishStatus filter
    })
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

  res.json({
    product,
  });
};
