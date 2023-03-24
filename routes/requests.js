import express from "express";
import {
  approveCreateRequest,
  approveDeleteRequest,
  approveEditRequest,
  createDeleteRequest,
  createEditRequest,
  getCreateRequests,
  getDeleteRequestByProductId,
  getDeleteRequests,
  getEditRequestByProductId,
  getEditRequests,
  rejectCreateRequest,
  rejectDeleteRequest,
  rejectEditRequest,
  updateEditRequest,
} from "../controllers/requests.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

// GET
router.get("/:category/create", getCreateRequests);
router.get("/:category/edit", getEditRequests);
router.get("/:category/:productId/edit", getEditRequestByProductId);
router.get("/:category/delete", getDeleteRequests);
router.get("/:category/:productId/delete", getDeleteRequestByProductId);

// POST
router.post("/:category/:productId/edit", createEditRequest);
router.post("/:category/:productId/edit/update", updateEditRequest);

// Approve and Rejecting create request
router.post("/:category/:productId/create/approve", approveCreateRequest);
router.post("/:category/:productId/create/reject", rejectCreateRequest);

// NOTE: request ID is in the request body not in the url
router.post("/:category/:productId/edit/approve", approveEditRequest);
router.post("/:category/:productId/edit/reject", rejectEditRequest);

router.post("/:category/:productId/delete", createDeleteRequest);
// NOTE: request ID is in the request body not in the url
router.post("/:category/:productId/delete/approve", approveDeleteRequest);
router.post("/:category/:productId/delete/reject", rejectDeleteRequest);

export default router;
