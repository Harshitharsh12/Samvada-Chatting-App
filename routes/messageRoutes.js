import express from "express";
import {
  getMessagesController,
  sendMessageController,
} from "../controllers/messageController.js";
import isLogin from "../middleWares/auth.js";
const router = express.Router();
router.post("/sendMessage/:id", isLogin, sendMessageController);
router.post("/getMessages/:id", isLogin, getMessagesController);
export default router;
