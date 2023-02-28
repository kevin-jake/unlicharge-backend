import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/products.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

// GET / READ Products
router.get("/:category", getProducts);
router.get("/:category/:id", getProductById);

router.use(checkAuth);

// CREATE /POST Products
router.post("/:category", createProduct);

export default router;
