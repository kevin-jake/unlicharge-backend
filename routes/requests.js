import express from "express";
import { createEditRequest } from "../controllers/requests.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

router.post("/:category/:id", createEditRequest);

export default router;
