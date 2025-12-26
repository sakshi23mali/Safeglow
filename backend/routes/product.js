import express from "express";
import { recommendProducts } from "../controllers/productController.js";

const router = express.Router();

// GET /api/products/recommend?skinType=oily
router.get("/recommend", recommendProducts);

export default router;