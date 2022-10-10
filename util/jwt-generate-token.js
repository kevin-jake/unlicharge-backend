const jwt = require("jsonwebtoken");

module.exports = function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      last_login: user.last_login,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
