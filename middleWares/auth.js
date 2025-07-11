import jwt from "jsonwebtoken";
const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).send({
        success: false,
        message: "Authentication Failed!!",
      });
    } else {
      const decode = jwt.verify(token, process.env.JWT_KEY);
      if (!decode) {
        return res.status(401).send({
          success: false,
          message: "Invalid Token!!",
        });
      } else {
        req.id = decode.id;
        next();
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
export default isLogin;
