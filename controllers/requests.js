import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import EditRequest from "../models/EditRequests.js";

/* CREATE */
export const createEditRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  let existingProduct;
  try {
    existingProduct = await Product.findOne({ _id: req.params.id });
  } catch (err) {
    const error = new Error(
      "Finding product failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  if (!existingProduct) {
    const error = new Error(
      "Product ID not found. Please enter a valid product ID.",
      404
    );
    return next(error);
  }

  const category =
    req.params.category === "ab"
      ? "ActiveBalancer"
      : req.params.category.charAt(0).toUpperCase() +
        req.params.category.slice(1);
  let status;
  if (req.userData.role != "Admin") {
    status = "Request";
  } else {
    status = "Approved";
  }

  let newSpec;
  const { name, imagePath, specs, brand, supplierLink, supplier } = req.body;

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
      productId: req.params.id,
      editRequest: true,
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
      productId: req.params.id,
      editRequest: true,
    });
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = specs;
    newSpec = new ActiveBalancer({
      strings: +strings || 0,
      balanceCurrent: +balanceCurrent || 0,
      price: +price || 0,
      balancingType,
      specCreator: req.userData.userId,
      productId: req.params.id,
      editRequest: true,
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

  const createdEditReq = new EditRequest({
    requestedProduct: req.params.id,
    name,
    category: category,
    newSpecs: newSpec.id,
    status,
    imagePath,
    brand,
    supplierLink,
    supplier,
    requestor: req.userData.userId,
  });

  try {
    await createdEditReq.save();
  } catch (err) {
    const error = new Error(
      "Creating Edit Request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  existingProduct.editRequests = existingProduct.editRequests.push(
    createdEditReq.id
  );
  try {
    await existingProduct.save();
  } catch (err) {
    const error = new Error(
      "Saving Product edit request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ editRequest: createdEditReq });
};

/* READ */
export const getProducts = async (req, res, next) => {
  let products;
  const category = req.params.category;
  try {
    products = await Product.find({
      category:
        category === "ab"
          ? "ActiveBalancer"
          : category.charAt(0).toUpperCase() + category.slice(1),
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
  const category = req.params.category;
  try {
    product = await Product.findOne({
      _id: req.params.id,
      category:
        category === "ab"
          ? "ActiveBalancer"
          : category.charAt(0).toUpperCase() + category.slice(1),
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
