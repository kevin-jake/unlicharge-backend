import express from "express";
import {
  createEditRequest,
  getEditRequestByProduct,
  getEditRequests,
} from "../controllers/requests.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

// GET
router.get("/:category/edits", getEditRequests);
router.get("/:category/:id/edits", getEditRequestByProduct);

// POST
router.post("/:category/:id", createEditRequest);

export default router;
