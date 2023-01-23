import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";

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
  const { name, category, specs, imagePath, brand, supplierLink, supplier } =
    req.body;

  if (category === "Battery") {
    const {
      type,
      nominalVoltage,
      capacity,
      pricePerPc,
      maxVoltage,
      minVoltage,
    } = specs;
    newSpec = new Battery({
      type,
      nominalVoltage: +nominalVoltage || 0,
      capacity: +capacity || 0,
      pricePerPc: +pricePerPc || 0,
      maxVoltage: +maxVoltage || 0,
      minVoltage: +minVoltage || 0,
      specCreator: req.userData.userId,
    });
  } else if (category === "BMS") {
    const {
      battType,
      strings,
      chargeCurrent,
      dischargeCurrent,
      voltage,
      portType,
      price,
    } = specs;
    newSpec = new BMS({
      battType,
      strings: +strings || 0,
      chargeCurrent: +chargeCurrent || 0,
      dischargeCurrent: +dischargeCurrent || 0,
      voltage: +voltage || 0,
      price: +price || 0,
      portType,
      specCreator: req.userData.userId,
    });
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = specs;
    newSpec = new ActiveBalancer({
      strings: +strings || 0,
      balanceCurrent: +balanceCurrent || 0,
      price: +price || 0,
      balancingType,
      specCreator: req.userData.userId,
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
    name,
    category,
    specs: newSpec.id,
    imagePath,
    brand,
    supplierLink,
    supplier,
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
  let products, specs;
  const category = req.params.category;
  if (category === "Battery") {
    specs = {
      type,
      nominalVoltage,
      capacity,
      pricePerPc,
      maxVoltage,
      minVoltage,
    };
  } else if (category === "BMS") {
    specs = {
      battType,
      strings,
      chargeCurrent,
      dischargeCurrent,
      voltage,
      portType,
      price,
    };
  } else if (category === "ActiveBalancer") {
    specs = { strings, balanceCurrent, balancingType, price };
  }

  try {
    products = await Product.find()
      .populate("specs")
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
