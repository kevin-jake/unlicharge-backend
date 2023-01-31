import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/products.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);
// GET / READ Products
router.get("/:category", getProducts);
router.get("/:category/:id", getProductById);

// CREATE /POST Products
router.post("/:category", createProduct);

export default router;
