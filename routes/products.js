import express from "express";
import { createProduct } from "../controllers/products.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

router.post("/", createProduct);

export default router;
