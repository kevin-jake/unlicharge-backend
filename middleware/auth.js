import jwt from "jsonwebtoken";

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      username: decodedToken.username,
      role: decodedToken.role,
    };
    next();
  } catch (err) {
    const error = new Error("Authentication failed!");
    error.status = 403;
    console.log(err);
    return next(error);
  }
};
