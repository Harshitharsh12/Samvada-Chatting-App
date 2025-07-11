import express from "express";
import {
  getOtherUsersController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/userController.js";
import isLogin from "../middleWares/auth.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", isLogin, logoutController);
router.get("/otherUsers", isLogin, getOtherUsersController);
export default router;
