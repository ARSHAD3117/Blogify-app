const jwt = require("jsonwebtoken");

const secret = "Arshad@1234";

function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.fullName,
    profileImg: user.profileImg,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function checkAuth(token) {
  const user = jwt.verify(token, secret);
  return user;
}

module.exports = {
  generateToken,
  checkAuth,
};
