import express from "express";
import {
  approveEditRequest,
  createEditRequest,
  getEditRequestByProductId,
  getEditRequests,
  rejectEditRequest,
} from "../controllers/requests.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

// GET
router.get("/:category/edits", getEditRequests);
router.get("/:category/:productId/edits", getEditRequestByProductId);

// POST
router.post("/:category/:productId", createEditRequest);
router.post("/:category/:productId/edits/approve", approveEditRequest);
router.post("/:category/:productId/edits/reject", rejectEditRequest);

export default router;
