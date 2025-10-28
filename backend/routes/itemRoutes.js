import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getExpiringProducts,
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Product routes
router.route("/").post(createProduct).get(getProducts);
router.route("/expiring/:days").get(getExpiringProducts);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default router;
