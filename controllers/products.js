import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import { categoryFormat } from "../util/categoryFormat.js";
import { batterySummary } from "../logic/batteryComputations.js";
import { sortByStatus, sortResults } from "../util/sortResults.js";

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
    const {
      nominalVoltage,
      capacity,
      pricePerPc,
      maxVoltage,
      minVoltage,
      internalResistance,
      chargeCRate,
      dischargeCRate,
      maxDischargeRate,
    } = req.body;
    newSpec = new Battery({
      ...req.body,
      nominalVoltage: +nominalVoltage,
      capacity: +capacity,
      pricePerPc: +pricePerPc,
      maxVoltage: +maxVoltage,
      minVoltage: +minVoltage,
      internalResistance: +internalResistance,
      chargeCRate: +chargeCRate,
      dischargeCRate: +dischargeCRate,
      maxDischargeRate: +maxDischargeRate,
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
      strings: +strings,
      chargeCurrent: +chargeCurrent,
      dischargeCurrent: +dischargeCurrent,
      voltage: +voltage,
      price: +price,
      portType,
      specCreator: req.userData.userId,
      productId: req.params.id,
      status,
    });
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = req.body;
    newSpec = new ActiveBalancer({
      ...req.body,
      strings: +strings,
      balanceCurrent: +balanceCurrent,
      price: +price,
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
  console.log("🚀 ~ file: products.js:123 ~ getProducts ~ category:", category);
  let filter = {
    category,
  };

  // Deconstructing pagination, sort and filters
  // TODO: Add selected battery on not filters or always show it
  const {
    selectedBattery,
    inputVoltage,
    inputCapacity,
    inputDod,
    sortBy,
    sortArrangement,
    search,
    battType,
    minPrice,
    maxPrice,
  } = req.query || {};
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 5;
  console.log(
    "🚀 ~ file: products.js:128 ~ getProducts ~ req.query:",
    req.query
  );

  // Filtering the results based on the filter inputs
  let specIds = [];
  try {
    const searchMinPrice = +minPrice || 0;
    const searchMaxPrice = +maxPrice || 1000000;
    if (category === "Battery") {
      const searchBattType =
        Boolean(battType) && JSON.parse(battType).length > 0
          ? JSON.parse(battType)
          : ["LiFePo4", "Li-On", "Lead Acid"];
      specIds = (
        await Battery.find({
          battType: { $in: searchBattType },
          pricePerPc: { $gt: searchMinPrice, $lt: searchMaxPrice },
          name: { $regex: search || "", $options: "i" },
        }).distinct("_id")
      ).map((id) => id.toString());
    }
    if (category === "BMS") {
      specIds = (
        await BMS.find({
          price: { $gt: searchMinPrice, $lt: searchMaxPrice },
          name: { $regex: search || "", $options: "i" },
        }).distinct("_id")
      ).map((id) => id.toString());
    }
    if (category === "ActiveBalancer") {
      specIds = (
        await ActiveBalancer.find({
          price: { $gt: searchMinPrice, $lt: searchMaxPrice },
          name: { $regex: search || "", $options: "i" },
        }).distinct("_id")
      ).map((id) => id.toString());
    }
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not filter the product`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  console.log("🚀 ~ file: products.js:156 ~ getProducts ~ specIds:", specIds);

  // Adding filters into the main query
  if (
    specIds.length > 0 ||
    (Boolean(battType) && category === "Battery") ||
    Boolean(maxPrice) ||
    Boolean(minPrice) ||
    Boolean(search)
  ) {
    filter = { ...filter, specs: { $in: specIds } };
  }

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

  console.log("🚀 ~ file: products.js:197 ~ getProducts ~ filter:", filter);
  try {
    products = await Product.find(filter)
      .populate({
        path: "specs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
      .populate({ path: "creator", select: "username imagePath" });
    // .skip(page * limit)
    // .limit(limit);
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Computation of battery build initial parameters
  // TODO: put inside a try-catch block
  if (Boolean(inputVoltage) && Boolean(inputCapacity)) {
    if (Boolean(inputVoltage) && category === "Battery") {
      products.map((product) => {
        const { specs } = product;
        const computedSpecs = batterySummary(
          specs,
          inputVoltage,
          inputCapacity,
          inputDod
        );
        const computedProductSpecs = { ...specs._doc, computedSpecs };
        product.specs._doc = computedProductSpecs;
      });
    }
  }

  // Sorting of results
  if (Boolean(sortBy) && Boolean(sortArrangement)) {
    try {
      products = sortResults(products, sortBy, sortArrangement, category);
      // TODO: Change into filter query
      if (true) {
        products = sortByStatus(products);
      }
    } catch (err) {
      const error = new Error(
        `Something went wrong, could not sort the product`
      );
      console.log(err);
      return res.status(500).json({ message: error.message });
    }
  }

  // Implementing custom pagination
  products = products.slice(page * limit, page * limit + limit);

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

export const getBattery = async (req, res, next) => {
  let battSpec;
  // Deconstructing pagination, sort and filters
  const { inputVoltage, inputCapacity, minPrice, maxPrice } = req.query || {};
  console.log(
    "🚀 ~ file: products.js:128 ~ getProducts ~ req.query:",
    req.query
  );
  if (Boolean(req.params.id)) {
    try {
      battSpec = await Battery.findById(req.params.id).populate({
        path: "specCreator",
        select: "username",
      });
    } catch (err) {
      const error = new Error(
        `Something went wrong, could not sort the product`
      );
      console.log(err);
      return res.status(500).json({ message: error.message });
    }
  }

  // Computation of battery build initial parameters
  // TODO: put inside a try-catch block
  if (Boolean(inputVoltage) && Boolean(inputCapacity)) {
    battSpec._doc.computedSpecs = batterySummary(
      battSpec._doc,
      inputVoltage,
      inputCapacity
    );
  }
  res.json(battSpec.toObject({ getters: true }));
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
