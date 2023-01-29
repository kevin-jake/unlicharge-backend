import express from "express";
import {
  approveEditRequest,
  createEditRequest,
  getEditRequestByProduct,
  getEditRequests,
  rejectEditRequest,
} from "../controllers/requests.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

// GET
router.get("/:category/edits", getEditRequests);
router.get("/:category/:id/edits", getEditRequestByProduct);

// POST
router.post("/:category/:id", createEditRequest);
router.post("/:category/:id/edits/approve", approveEditRequest);
router.post("/:category/:id/edits/reject", rejectEditRequest);

export default router;
