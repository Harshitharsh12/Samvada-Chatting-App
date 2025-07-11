import consModel from "../modals/conversationModel.js";
import messageModel from "../modals/messageModel.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

const sendMessageController = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });
    if (!newMessage) {
      return res.status(400).send({
        success: false,
        message: "Error In Sending Message!!",
      });
    } else {
      // let cons = await consModel.find({
      //   participants: { $all: [senderId, receiverId] },
      // });
      // if (cons[0]) {
      //   cons[0].messages.push(newMessage._id);
      //   await cons[0].save();
      // }
      // or
      let cons = await consModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (cons) {
        cons.messages.push(newMessage._id);
        await cons.save();
      } else {
        cons = await consModel.create({
          participants: [senderId, receiverId],
          messages: [newMessage._id],
        });
      }
      res.status(201).send({
        status: true,
        message: "Message Sent Successfully!!",
        newMessage,
      });
    }
    // SOCKET IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
const getMessagesController = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;
    const conversation = await consModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate("messages");
    return res.status(201).json(conversation?.messages);
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
export { sendMessageController, getMessagesController };
