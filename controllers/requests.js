import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import EditRequest from "../models/EditRequests.js";
import { categoryFormat } from "../util/categoryFormat.js";
import mongoose from "mongoose";

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

  //TODO: Improve status changing
  let status, editReqStatus;
  if (
    req.userData.role != "Admin" ||
    req.userData.id != existingProduct.creator
  ) {
    status = "Request";
    editReqStatus = "Request";
  } else {
    status = "Active";
    editReqStatus = "Approved";
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
      editRequest: true,
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
      editRequest: true,
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
      editRequest: true,
      status,
    });
  }

  // Check if there are already existing request for the spec
  let duplicateRequest;
  try {
    duplicateRequest = await mongoose
      .model(category)
      .find({
        ...req.body,
        status: ["Request", "Active"],
        productId: req.params.id,
      })
      .populate("specCreator", "username");
  } catch (err) {
    const error = new Error(
      "Finding duplicate request failed. Please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  if (duplicateRequest.length != 0) {
    const error = new Error(
      `There is a duplicate request by ${duplicateRequest[0].specCreator.username}, no need to request. Please wait for the request to be approved.`,
      400
    );
    return next(error);
  }

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
    category: category,
    newSpecs: newSpec.id,
    status: editReqStatus,
    requestor: req.userData.userId,
    comment: req.body.commentBody
      ? [
          {
            userId: req.userData.userId,
            body: req.body.commentBody,
          },
        ]
      : [],
  });

  // Save Edit Request ID on the Product editRequests field
  existingProduct.editRequests.push(createdEditReq.id);
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

export const approveEditRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Approving a request:
  // It will change EditRequest status to "Approved" and Specs table status to "Active".
  // Add comments to comment field.
  // Update old Spec to Product previousData as id reference.
  // Add editor and approver on Product editor and approvedBy fields.

  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get EditRequest details
  let editRequest;
  try {
    editRequest = await EditRequest.findById(req.body.reqId).populate(
      "newSpecs"
    );
  } catch (err) {
    const error = new Error(
      "Finding edit requests failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return next(error);
  }

  if (!product) {
    const error = new Error(`Product ID - (${req.params.id}) not found`);
    error.status = 404;
    return next(error);
  }

  // Updating Edit Request
  editRequest.status = "Approved";
  req.body.commentBody
    ? editRequest.comment.push({
        body: req.body.commentBody,
        userId: req.userData.userId,
      })
    : {};
  try {
    await editRequest.save();
  } catch (err) {
    const error = new Error(`Updating edit request failed, please try again.`);
    error.status = 500;
    console.log(err);
    return next(error);
  }

  // Updating (Battery, BMS, Active Balancer) spec table
  try {
    await mongoose
      .model(category)
      .findByIdAndUpdate(editRequest.newSpecs.id, { status: "Active" });
  } catch (err) {
    const error = new Error(
      `Finding specs for edit request failed, please try again.`
    );
    error.status = 500;
    console.log(err);
    return next(error);
  }
  try {
    await mongoose
      .model(category)
      .findByIdAndUpdate(product.specs, { status: "Replaced" });
  } catch (err) {
    const error = new Error(
      `Finding specs for edit request failed, please try again.`
    );
    error.status = 500;
    console.log(err);
    return next(error);
  }

  // Updating the Product
  let newProduct = {
    specs: editRequest.newSpecs.id,
    editor: editRequest.requestor,
    approvedBy: req.userData.userId,
    previousData: product.specs,
  };
  try {
    newProduct = await Product.findByIdAndUpdate(req.params.id, newProduct);
  } catch (err) {
    const error = new Error(
      "Approving Product edit request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  res.status(201).json({ newProduct: newProduct });
};

export const rejectEditRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Rejecting a request:
  // It will change EditRequest status to "Reject" and Specs table status to "Rejected".
  // Add comments to comment field reject comment is required.
  // Add userid on comment.

  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get EditRequest details
  let editRequest;
  try {
    editRequest = await EditRequest.findById(req.body.reqId).populate(
      "newSpecs"
    );
  } catch (err) {
    const error = new Error(
      "Finding edit requests failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  // Updating Edit Request
  editRequest.status = "Rejected";
  if (req.body.commentBody) {
    editRequest.comment.push({
      body: req.body.commentBody,
      userId: req.userData.userId,
    });
  } else {
    const error = new Error(
      "Comment is required please input a comment before rejecting",
      500
    );
    return next(error);
  }

  try {
    await editRequest.save();
  } catch (err) {
    const error = new Error(`Updating edit request failed, please try again.`);
    error.status = 500;
    console.log(err);
    return next(error);
  }

  res.status(201).json({ editRequest: editRequest });
};

/* READ */
export const getEditRequests = async (req, res, next) => {
  let editRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  let filter;
  if (req.userData.role != "Admin") {
    filter = { category };
  } else {
    filter = { category, requestor: req.userData.userId };
  }

  try {
    editRequests = await EditRequest.find({ filter })
      .populate({
        path: "newSpecs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
      .populate({ path: "requestor", select: "username imagePath" });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Edit Request - ${category}`
    );
    console.log(err);
    return next(error);
  }

  res.json({
    editRequests: editRequests.map((editRequest) =>
      editRequest.toObject({ getters: true })
    ),
  });
};

export const getEditRequestByProduct = async (req, res, next) => {
  let editRequests;
  const category = categoryFormat(req.params.category);
  const productId = req.params.id;

  // TODO: Filter more efficiently
  try {
    editRequests = await Product.find({
      category: category,
      _id: productId,
    }).populate({
      path: "editRequests",
      populate: {
        path: "newSpecs",
      },
    });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Product - ${category}`
    );
    console.log(err);
    return next(error);
  }

  res.json({
    editRequests: editRequests.map((editRequest) =>
      editRequest.toObject({ getters: true })
    ),
  });
};
