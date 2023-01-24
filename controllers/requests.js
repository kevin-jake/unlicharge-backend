import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import EditRequest from "../models/EditRequests.js";
import { categoryFormat } from "../util/categoryFormat.js";

/* CREATE */
export const createEditRequest = async (req, res, next) => {
  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Check for product ID and category if product is existing in the correct category
  let existingProduct;
  try {
    existingProduct = await Product.findOne({
      _id: req.params.id,
      category: category,
    });
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
      `Product ID not found on category: ${category}. Please enter a valid product ID.`,
      404
    );
    return next(error);
  }

  //TODO: Status changer
  let status;
  if (req.userData.role != "Admin") {
    status = "Request";
  } else {
    status = "Approved";
  }

  // Initialize Specs creation
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

  // Check if there are already existing request for the spec

  // Saving of new specs on the table
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

  // Create Edit Request if specs creation is successful
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

  // Save Edit Request ID on the Product editRequests field
  existingProduct.editRequests.push(createdEditReq.id);
  console.log(
    "🚀 ~ file: requests.js:137 ~ createEditRequest ~ existingProduct.editRequests",
    existingProduct.editRequests
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

  // Saving of Edit Request on the EditRequests table
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
