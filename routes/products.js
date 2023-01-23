import express from "express";
import { createProduct, getProducts } from "../controllers/products.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.get("/:category", getProducts);

router.use(checkAuth);

router.post("/", createProduct);

export default router;
