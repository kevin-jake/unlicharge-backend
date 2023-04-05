import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Battery from "../models/specsModel/Battery.js";
import BMS from "../models/specsModel/BMS.js";
import ActiveBalancer from "../models/specsModel/ActiveBalancer.js";
import EditRequest from "../models/EditRequests.js";
import { categoryFormat } from "../util/categoryFormat.js";
import mongoose from "mongoose";
import DeleteRequest from "../models/DeleteRequests.js";

/* CREATE */
export const approveCreateRequest = async (req, res, next) => {
  // Approving a request:
  // It will change publishStatus to "Approved" on the Product table

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating the Product
  let approvedProduct = {
    publishStatus: "Approved",
    processedBy: req.userData.userId,
  };
  try {
    approvedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      approvedProduct,
      { new: true }
    );
  } catch (err) {
    const error = new Error(
      "Approving Product create request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  res.status(201).json({ approvedProduct: approvedProduct });
};

export const rejectCreateRequest = async (req, res, next) => {
  // Rejecting a create request:
  // It will change publishStatus to "Rejected" on the Product table

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    return res.status(422).json({ message: error.message });
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating the Product
  let approvedProduct = {
    publishStatus: "Rejected",
    processedBy: req.userData.userId,
  };
  try {
    approvedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      approvedProduct,
      { new: true }
    );
  } catch (err) {
    const error = new Error(
      "Rejecting Product create request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  res.status(201).json({ approvedProduct: approvedProduct });
};

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
      _id: req.params.productId,
      category: category,
    });
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  if (!existingProduct) {
    const error = new Error(
      `Product ID not found on category: ${category}. Please enter a valid product ID.`
    );
    return res.status(404).json({ message: error.message });
  }

  //TODO: Improve status changing
  let status, editReqStatus;
  if (
    req.userData.role == "Admin" ||
    req.userData.userId == existingProduct.creator
  ) {
    status = "Active";
    editReqStatus = "Approved";
  } else {
    status = "Request";
    editReqStatus = "Request";
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
      productId: req.params.productId,
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
      productId: req.params.productId,
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
      productId: req.params.productId,
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
        productId: req.params.productId,
      })
      .populate("specCreator", "username");
  } catch (err) {
    const error = new Error(
      "Finding duplicate request failed. Please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  if (duplicateRequest.length != 0) {
    const error = new Error(
      `There is a duplicate request by ${duplicateRequest[0].specCreator?.username}, no need to request. Please wait for the request to be approved.`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating of old spec status on the table
  if (editReqStatus === "Approved") {
    try {
      await mongoose
        .model(category)
        .findByIdAndUpdate(existingProduct.specs.toString(), {
          status: "Replaced",
        });
    } catch (err) {
      const error = new Error(`Updating ${category} failed, please try again.`);
      console.log(err);
      return res.status(500).json({ message: error.message });
    }
  }

  // TODO: Implement rollback on failure???
  // Saving of new specs on the table
  try {
    await newSpec.save();
  } catch (err) {
    const error = new Error(`Creating ${category} failed, please try again.`);
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Create Edit Request if specs creation is successful
  const createdEditReq = new EditRequest({
    requestedProduct: req.params.productId,
    processedBy: editReqStatus === "Approved" ? req.userData.userId : null,
    specsToReplace: editReqStatus === "Approved" ? existingProduct.specs : null,
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
  if (editReqStatus === "Approved") {
    existingProduct.specs = newSpec.id;
    existingProduct.previousData = existingProduct.specs;
  }
  try {
    await existingProduct.save();
  } catch (err) {
    const error = new Error(
      "Saving Product edit request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Saving of Edit Request on the EditRequests table
  try {
    await createdEditReq.save();
  } catch (err) {
    const error = new Error("Creating Edit Request failed, please try again.");
    console.log(err);
    return res.status(500).json({ message: error.message });
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
  // Update Old Spec to Edit Request specsToReplace as id reference.
  // Add editor and approver on Product editor and processedBy fields.

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
      "Finding edit requests failed, please try again later."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating Edit Request
  editRequest.status = "Approved";
  editRequest.processedBy = req.userData.userId;
  editRequest.specsToReplace = product.specs;
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
    console.log(err);
    return res.status(500).json({ message: error.message });
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
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  try {
    await mongoose
      .model(category)
      .findByIdAndUpdate(product.specs, { status: "Replaced" });
  } catch (err) {
    const error = new Error(
      `Finding specs for edit request failed, please try again.`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Updating the Product
  let newProduct = {
    specs: editRequest.newSpecs.id,
    editor: editRequest.requestor,
  };
  try {
    newProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      newProduct
    ).populate({
      path: "editRequests",
      select: "newSpecs specsToReplace status requestor createdAt updatedAt",
      match: { _id: editRequest.id },
    });
  } catch (err) {
    const error = new Error(
      "Approving Product edit request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  res.status(201).json({ newProduct: newProduct });
};

export const rejectEditRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Rejecting a request:
  // It will change EditRequest status to "Rejected".
  // Check if product is already "Deleted"
  // Add comments to comment field reject comment is required.
  // Add userid on comment.

  const errors = validationResult(req);
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
      "Finding edit requests failed, please try again later."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating Edit Request
  editRequest.status = "Rejected";
  editRequest.processedBy = req.userData.userId;
  if (req.body.commentBody) {
    editRequest.comment.push({
      body: req.body.commentBody,
      userId: req.userData.userId,
    });
  } else {
    const error = new Error(
      "Comment is required please input a comment before rejecting"
    );
    return res.status(500).json({ message: error.message });
  }

  try {
    await editRequest.save();
  } catch (err) {
    const error = new Error(`Updating edit request failed, please try again.`);
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ editRequest: editRequest });
};

// TODO: Implement updating of request
export const updateEditRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   ...specs
  // }
  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  if (!req.body.reqId) {
    return next(new Error("Need to input request Id on the request body", 422));
  }

  // Get EditRequest details
  let editRequest;
  try {
    editRequest = await EditRequest.findById(req.body.reqId).populate(
      "newSpecs"
    );
  } catch (err) {
    const error = new Error(
      "Finding edit requests failed, please try again later."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Initialize Specs creation
  let updatedSpec;
  if (category === "Battery") {
    const { nominalVoltage, capacity, pricePerPc, maxVoltage, minVoltage } =
      req.body;
    updatedSpec = {
      ...req.body,
      nominalVoltage: +nominalVoltage || 0,
      capacity: +capacity || 0,
      pricePerPc: +pricePerPc || 0,
      maxVoltage: +maxVoltage || 0,
      minVoltage: +minVoltage || 0,
      specCreator: req.userData.userId,
      productId: req.params.productId,
    };
  } else if (category === "BMS") {
    const {
      strings,
      chargeCurrent,
      dischargeCurrent,
      voltage,
      portType,
      price,
    } = req.body;
    updatedSpec = {
      ...req.body,
      strings: +strings || 0,
      chargeCurrent: +chargeCurrent || 0,
      dischargeCurrent: +dischargeCurrent || 0,
      voltage: +voltage || 0,
      price: +price || 0,
      portType,
      specCreator: req.userData.userId,
      productId: req.params.productId,
    };
  } else if (category === "ActiveBalancer") {
    const { strings, balanceCurrent, balancingType, price } = req.body;
    updatedSpec = {
      ...req.body,
      strings: +strings || 0,
      balanceCurrent: +balanceCurrent || 0,
      price: +price || 0,
      balancingType,
      specCreator: req.userData.userId,
      productId: req.params.productId,
    };
  }

  // Saving of updated specs on the table
  let updatedSpecs;
  try {
    updatedSpecs = await mongoose
      .model(category)
      .findByIdAndUpdate(editRequest.newSpecs.id, updatedSpec, { new: true });
  } catch (err) {
    const error = new Error(`Creating ${category} failed, please try again.`);
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json(updatedSpecs);
};

export const createDeleteRequest = async (req, res, next) => {
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
      _id: req.params.productId,
      category: category,
    });
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  if (!existingProduct) {
    const error = new Error(
      `Product ID not found on category: ${category}. Please enter a valid product ID.`
    );
    return res.status(404).json({ message: error.message });
  }

  //TODO: Improve status changing
  let status, deleteReqStatus;
  if (
    req.userData.role == "Admin" ||
    req.userData.userId == existingProduct.creator
  ) {
    status = "Deleted";
    deleteReqStatus = "Approved";
  } else {
    deleteReqStatus = "Request";
  }

  // Check if there are already existing request for the spec
  let duplicateRequest;
  try {
    duplicateRequest = await DeleteRequest.find({
      status: ["Request", "Approved"],
      requestedProduct: req.params.productId,
    }).populate("requestor", "username");
  } catch (err) {
    const error = new Error(
      "Finding duplicate request failed. Please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  if (duplicateRequest.length != 0) {
    const error = new Error(
      `There is a duplicate request by ${duplicateRequest[0].requestor.username}, no need to request. Please wait for the request to be approved.`
    );
    return res.status(400).json({ message: error.message });
  }

  // Create Delete Request if specs creation is successful
  const createdDelReq = new DeleteRequest({
    requestedProduct: req.params.productId,
    processedBy: deleteReqStatus === "Approved" ? req.userData.userId : null,
    category: category,
    status: deleteReqStatus,
    requestor: req.userData.userId,
    deleteReason: req.body.deleteReason,
    comment: req.body.commentBody
      ? [
          {
            userId: req.userData.userId,
            body: req.body.commentBody,
          },
        ]
      : [],
  });

  // Saving of Delete Request on the DeleteRequests table
  let delReq;
  try {
    delReq = await createdDelReq.save();
  } catch (err) {
    const error = new Error(
      "Creating Delete Request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Save new Product status
  existingProduct.deleteRequests.push(delReq.id);
  if (status === "Deleted") {
    existingProduct.status = status;
  }
  try {
    await existingProduct.save();
  } catch (err) {
    const error = new Error(
      "Saving Product delete request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ deleteRequest: createdDelReq });
};

export const approveDeleteRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Approving a request:
  // It will change DeleteRequst status to "Approved" and Product table status to "Deleted".
  // Add comments to comment field.
  // Add editor and approver on Product editor and processedBy fields.

  const errors = validationResult(req);
  const category = categoryFormat(req.params.category);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get DeleteRequest details
  let deleteRequest;
  try {
    deleteRequest = await DeleteRequest.findById(req.body.reqId);
  } catch (err) {
    const error = new Error(
      "Finding delete requests failed, please try again later."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating Delete Request
  deleteRequest.status = "Approved";
  deleteRequest.processedBy = req.userData.userId;
  req.body.commentBody
    ? deleteRequest.comment.push({
        body: req.body.commentBody,
        userId: req.userData.userId,
      })
    : {};
  try {
    await deleteRequest.save();
  } catch (err) {
    const error = new Error(
      `Updating delete request failed, please try again.`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Updating the Product publishStatus to Deleted
  let deletedProduct;
  try {
    deletedProduct = await Product.findByIdAndUpdate(req.params.productId, {
      publishStatus: "Deleted",
    }).populate({
      path: "deleteRequests",
      select: "status requestor createdAt updatedAt",
      match: { _id: deleteRequest.id },
    });
  } catch (err) {
    const error = new Error(
      "Approving Product delete request failed, please try again."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }
  res.status(201).json({ deletedProduct: deletedProduct });
};

export const rejectDeleteRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Rejecting a request:
  // It will change DeleteRequest status to "Rejected".
  // Check if product is already "Deleted"
  // Add comments to comment field reject comment is required.
  // Add userid on comment.

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get DeleteRequest details
  let deleteRequest;
  try {
    deleteRequest = await DeleteRequest.findById(req.body.reqId);
  } catch (err) {
    const error = new Error(
      "Finding delete requests failed, please try again later."
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (!product) {
    const error = new Error(`Product ID: (${req.params.productId}) not found`);
    return res.status(404).json({ message: error.message });
  }

  if (product.publishStatus === "Deleted") {
    const error = new Error(
      `Product ID: (${req.params.productId}) is already deleted`
    );
    return res.status(400).json({ message: error.message });
  }

  // Updating Delete Request
  deleteRequest.status = "Rejected";
  deleteRequest.processedBy = req.userData.userId;
  if (req.body.commentBody) {
    deleteRequest.comment.push({
      body: req.body.commentBody,
      userId: req.userData.userId,
    });
  } else {
    const error = new Error(
      "Comment is required please input a comment before rejecting"
    );
    return res.status(400).json({ message: error.message });
  }

  try {
    await deleteRequest.save();
  } catch (err) {
    const error = new Error(`Updating edit request failed, please try again.`);
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ deleteRequest: deleteRequest });
};

/* READ */
export const getCreateRequests = async (req, res, next) => {
  let createRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  let filter;
  if (req.userData.role === "Admin") {
    filter = { category };
  } else {
    filter = {
      category,
      creator: req.userData.userId,
    };
  }
  try {
    createRequests = await Product.find(filter)
      .populate({
        path: "specs",
        populate: {
          path: "specCreator",
          select: "username imagePath",
        },
      })
      .populate({ path: "creator processedBy", select: "username imagePath" });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Create Request - ${category}`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  res.json({
    createRequests: createRequests.map((createRequest) =>
      createRequest.toObject({ getters: true })
    ),
  });
};

export const getEditRequests = async (req, res, next) => {
  let editRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  // TODO: Add status filters for "Deleted" products
  let filter;
  if (req.userData.role === "Admin" || req.query.isMyRequestOnly === "false") {
    filter = { category };
  } else {
    filter = { category, requestor: req.userData.userId };
  }
  try {
    editRequests = await EditRequest.find(filter)
      .populate({
        path: "newSpecs specsToReplace",
        populate: {
          path: "specCreator",
          select: "username imagePath",
        },
      })
      .populate({
        path: "requestedProduct",
        populate: {
          path: "specs creator",
        },
      })
      .populate({ path: "requestor processedBy", select: "username imagePath" })
      .populate({
        path: "comment",
        populate: {
          path: "userId",
          select: "username imagePath",
        },
      });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Edit Request - ${category}`
    );
    console.log(err);
    return res.status(500).json({ message: error.message });
  }

  if (req.query.isMyRequestOnly === "false" && req.userData.role === "User") {
    editRequests = editRequests.filter((editRequest) => {
      const requestedProduct = editRequest.requestedProduct;
      return (
        !requestedProduct ||
        requestedProduct.creator._id.toString() === req.userData.userId ||
        editRequest.requestor._id.toString() === req.userData.userId
      );
    });
  }

  res.json({
    editRequests: editRequests.map((editRequest) =>
      editRequest.toObject({ getters: true })
    ),
  });
};

export const getEditRequestByProductId = async (req, res, next) => {
  let editRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  let filter = { requestedProduct: req.params.productId };
  if (req.userData.role != "Admin") {
    filter = { ...filter, category };
  } else {
    filter = { ...filter, category, requestor: req.userData.userId };
  }
  try {
    editRequests = await EditRequest.find(filter)
      .populate({
        path: "newSpecs",
        populate: {
          path: "specCreator",
          select: "username imagePath",
        },
      })
      .populate({ path: "requestor ", select: "username imagePath" })
      .populate({
        path: "comment",
        populate: {
          path: "userId",
          select: "username imagePath",
        },
      });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Edit Request - ${category}`
    );
    console.log(err);
    return res.status(404).json({ message: error.message });
  }

  res.json({
    editRequests: editRequests.map((editRequest) =>
      editRequest.toObject({ getters: true })
    ),
  });
};

export const getDeleteRequests = async (req, res, next) => {
  let deleteRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  let filter;
  if (req.userData.role === "Admin" || req.query.isMyRequestOnly === "false") {
    filter = { category };
  } else {
    filter = { category, requestor: req.userData.userId };
  }

  try {
    deleteRequests = await DeleteRequest.find(filter)
      .populate({ path: "requestor processedBy", select: "username imagePath" })
      .populate({
        path: "requestedProduct",
        populate: {
          path: "specs creator",
        },
      })
      .populate({
        path: "comment",
        populate: {
          path: "userId",
          select: "username imagePath",
        },
      });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Delete Request - ${category}`
    );
    console.log(err);
    return res.status(404).json({ message: error.message });
  }

  if (req.query.isMyRequestOnly === "false" && req.userData.role === "User") {
    deleteRequests = deleteRequests.filter((deleteRequest) => {
      const requestedProduct = deleteRequest.requestedProduct;
      return (
        !requestedProduct ||
        requestedProduct.creator._id.toString() === req.userData.userId ||
        deleteRequest.requestor._id.toString() === req.userData.userId
      );
    });
  }

  res.json({
    deleteRequests: deleteRequests.map((deleteRequest) =>
      deleteRequest.toObject({ getters: true })
    ),
  });
};

export const getDeleteRequestByProductId = async (req, res, next) => {
  let deleteRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own delete requests if not the admin
  let filter = { requestedProduct: req.params.productId };
  if (req.userData.role != "Admin") {
    filter = { ...filter, category };
  } else {
    filter = { ...filter, category, requestor: req.userData.userId };
  }
  try {
    deleteRequests = await DeleteRequest.find(filter)
      .populate({ path: "requestor", select: "username imagePath" })
      .populate({
        path: "comment",
        populate: {
          path: "userId",
          select: "username imagePath",
        },
      });
  } catch (err) {
    const error = new Error(
      `Something went wrong, could not find the Delete Request - ${category}`
    );
    console.log(err);
    return res.status(404).json({ message: error.message });
  }

  res.json({
    deleteRequests: deleteRequests.map((deleteRequest) =>
      deleteRequest.toObject({ getters: true })
    ),
  });
};
