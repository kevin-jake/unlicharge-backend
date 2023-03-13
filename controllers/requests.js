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
      productId: req.params.productId,
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
      productId: req.params.productId,
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
      productId: req.params.productId,
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
        productId: req.params.productId,
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
    requestedProduct: req.params.productId,
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
  if (existingProduct.publishStatus === "Approved") {
    existingProduct.specs = newSpec.id;
    existingProduct.previousData = existingProduct.specs;
  }
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
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return next(error);
  }

  if (!product) {
    const error = new Error(`Product ID - (${req.params.productId}) not found`);
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
    newProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      newProduct
    ).populate({
      path: "editRequests",
      select: "newSpecs status requestor createdAt updatedAt",
      match: { _id: editRequest.id },
    });
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
    return next(error);
  }

  if (!product) {
    const error = new Error(`Product ID - (${req.params.productId}) not found`);
    error.status = 404;
    return next(error);
  }
  // Updating the Product
  let approvedProduct = {
    publishStatus: "Approved",
    approvedBy: req.userData.userId,
  };
  try {
    approvedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      approvedProduct,
      { new: true }
    );
  } catch (err) {
    const error = new Error(
      "Approving Product create request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  res.status(201).json({ approvedProduct: approvedProduct });
};

export const rejectEditRequest = async (req, res, next) => {
  // body: {
  //   reqId: "",
  //   commentBody: ""
  // }

  // Rejecting a request:
  // It will change EditRequest status to "Rejected".
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
      "Finding edit requests failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
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
    const error = new Error(
      `Creating ${category} failed, please try again.`,
      500
    );
    console.log(err);
    return next(error);
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
      "Finding duplicate request failed. Please try again.",
      500
    );
    console.log(err);
    return next(error);
  }
  if (duplicateRequest.length != 0) {
    const error = new Error(
      `There is a duplicate request by ${duplicateRequest[0].requestor.username}, no need to request. Please wait for the request to be approved.`,
      400
    );
    return next(error);
  }

  // Create Delete Request if specs creation is successful
  const createdDelReq = new DeleteRequest({
    requestedProduct: req.params.productId,
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
      "Creating Delete Request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
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
      "Saving Product delete request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
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
  // Add editor and approver on Product editor and approvedBy fields.

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
      "Finding delete requests failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  // Get Product details
  let product;
  try {
    product = await Product.findById(req.params.productId);
  } catch (err) {
    const error = new Error("Finding product failed, please try again later.");
    console.log(err);
    return next(error);
  }

  if (!product) {
    const error = new Error(`Product ID - (${req.params.productId}) not found`);
    error.status = 404;
    return next(error);
  }

  // Updating Delete Request
  deleteRequest.status = "Approved";
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
    error.status = 500;
    console.log(err);
    return next(error);
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
      "Approving Product delete request failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
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
    error.status = 404;
    console.log(err);
    return next(error);
  }

  // Updating Delete Request
  deleteRequest.status = "Rejected";
  if (req.body.commentBody) {
    deleteRequest.comment.push({
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
    await deleteRequest.save();
  } catch (err) {
    const error = new Error(`Updating edit request failed, please try again.`);
    error.status = 500;
    console.log(err);
    return next(error);
  }

  res.status(201).json({ deleteRequest: deleteRequest });
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
    editRequests = await EditRequest.find(filter)
      .populate({
        path: "newSpecs",
        populate: {
          path: "specCreator",
          select: "username",
        },
      })
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
          select: "username",
        },
      })
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

export const getDeleteRequests = async (req, res, next) => {
  let deleteRequests;
  const category = categoryFormat(req.params.category);

  // Only show your own edit requests if not the admin
  let filter;
  if (req.userData.role != "Admin") {
    filter = { category };
  } else {
    filter = { category, requestor: req.userData.userId };
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
    return next(error);
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
    return next(error);
  }

  res.json({
    deleteRequests: deleteRequests.map((deleteRequest) =>
      deleteRequest.toObject({ getters: true })
    ),
  });
};
