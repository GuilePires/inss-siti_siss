const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, user_type: user.user_type }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
