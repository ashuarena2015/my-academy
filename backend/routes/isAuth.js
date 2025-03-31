const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = await jwt.verify(
      token,
      process.env.SECRET_KEY || "1234!@#%<{*&)",
    );

    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error Validating Token" });
  }
};
