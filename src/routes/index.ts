import { Router } from "express";
import { home } from "../controllers/pageController";

var router = Router();

router.get("/", home);

export default router;
