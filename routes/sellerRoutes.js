import express from "express";
import {sellerLogin,sellerSignup} from "../controller/sellerController.js";

const router = express.Router();

router.post("/login",sellerLogin);
router.post("/signup",sellerSignup);

export default router;
