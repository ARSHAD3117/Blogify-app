const { checkAuth } = require("../services/auth");

function checkAuthFromCookie(cookieName) {
  return function (req, res, next) {
    const token = req.cookies[cookieName];
    if (!token) return next();
    try {
      const user = checkAuth(token);
      req.user = user;
    } catch (error) {}
    return next();
  };
}

module.exports = { checkAuthFromCookie };
