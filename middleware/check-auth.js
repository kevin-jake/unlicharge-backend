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
    error.status = 403;
    return next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
