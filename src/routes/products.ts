import { Router } from "express";
import { getProducts, getProduct } from "../controllers/pageController";

var router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
