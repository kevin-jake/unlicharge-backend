import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import { categoryFormat } from "../util/categoryFormat.js";
import { batterySummary } from "../logic/batteryComputations.js";

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
    const error = new Error(`Creating ${category} failed, please try again.`);
    console.log(err);
    return res.status(500).json({ message: error.message });
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
      `Updating ${category} productId failed, please try again.`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Saving of new Product
  try {
    await createdProduct.save();
  } catch (err) {
    const error = new Error("Creating Product failed, please try again.");
    console.log(err);
    return res.status(500).json({ message: error.message });
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
        // { ...filter, publishStatus: "Deleted", creator: req.userData.userId },
      ],
    };
  }
  const { initParams, pagination } = req.query || {};
  let pages = JSON.parse(pagination);
  const page = parseInt(pages.page) - 1 || 0;
  const limit = parseInt(pages.limit) || 5;

  try {
    products = await Product.find(filter)
      .populate({
        path: "specs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
      .populate({ path: "creator", select: "username imagePath" })
      .skip(page * limit)
      .limit(limit);
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (Boolean(initParams)) {
    const initialParams = JSON.parse(initParams);
    if (Boolean(initialParams?.batteryVoltage) && category === "Battery") {
      console.log("computing");
      products.map((product) => {
        const { specs } = product;
        const computedSpecs = batterySummary(specs, initialParams);
        const computedProductSpecs = { ...specs._doc, computedSpecs };
        product.specs._doc = computedProductSpecs;
      });
    }
  }

  // products.sort((a, b) => {
  //   let fa = a.specs.name.toLowerCase(),
  //     fb = b.specs.name.toLowerCase();

  //   if (fa < fb) {
  //     return -1;
  //   }
  //   if (fa > fb) {
  //     return 1;
  //   }
  //   return 0;
  // });

  // products.sort((a, b) => {
  //   return a.specs.pricePerPc - b.specs.pricePerPc;
  // });

  const total = await Product.countDocuments(filter);
  const response = {
    total,
    page: page + 1,
    limit,
    products,
  };

  res.json({
    ...response,
    products: response.products.map((product) =>
      product.toObject({ getters: true })
    ),
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
      .populate({ path: "creator", select: "username imagePath" });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.json({
    product,
  });
};

// TODO: get products sorted or filtered from frontend
