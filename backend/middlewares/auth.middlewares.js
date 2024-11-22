const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Not authorized. try again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Not authorized. try again" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: error.message });
  }
};

module.exports = {
    userAuth
}