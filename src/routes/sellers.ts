import { Router } from "express";
import { getSellers, getSeller } from "../controllers/pageController";

var router = Router();

router.get("/", getSellers);
router.get("/:id", getSeller);

export default router;
