import express from "express";
import {userLogin,userSignup} from "../controller/userController.js";

const router = express.Router();

router.post("/login",userLogin);
router.post("/signup",userSignup);

export default router;