import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("users", userSchema);
export default userModel;
