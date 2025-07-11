import userModel from "../modals/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const registerController = async (req, res) => {
  try {
    const { fullName, userName, password, gender } = req.body;
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?userName=${userName}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?userName=${userName}`;
    const user = await userModel.findOne({ userName });
    if (user) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered Using This UserName!!",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = await new userModel({
        fullName,
        userName,
        password: hashPassword,
        profilePic: gender === "Male" ? maleProfilePhoto : femaleProfilePhoto,
        gender,
      }).save();
      if (!newUser) {
        return res.status(200).send({
          success: false,
          message: "Error In Registration!!",
        });
      } else {
        res.status(201).send({
          success: true,
          message: "User Register Successfully!!",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userModel.findOne({ userName });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "Something Went wrong!!",
      });
    } else {
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        res.status(200).send({
          success: false,
          message: "Something Went wrong!!",
        });
      } else {
        const token = await jwt.sign({ id: user._id }, process.env.JWT_KEY, {
          expiresIn: "1d",
        });
        res.status(201).cookie("token", token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: "strict",
        });
        res.status(201).send({
          success: true,
          message: "Login Successfully!!",
          userData: user,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const logoutController = (req, res) => {
  try {
    res.status(201).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logout Successfully!!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getOtherUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({ _id: { $ne: req.id } })
      .select("-password");
    if (!users) {
      res.status(200).send({
        success: false,
        message: "No Other users Here!!",
      });
    } else {
      res.status(201).send({
        success: true,
        message: "Other-Users Fetched Successfully!!",
        users,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  getOtherUsersController,
};
