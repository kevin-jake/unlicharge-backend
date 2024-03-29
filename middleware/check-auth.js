import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Authorization: 'Bearer TOKEN'

    if (req.baseUrl != "/products") {
      if (!token) {
        throw new Error("Authentication failed!");
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role,
      };
    }
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role,
      };
    }
    next();
  } catch (err) {
    console.log(err);
    const error = new Error("Authentication failed!");
    return res.status(404).json({ message: error.message });
  }
};
