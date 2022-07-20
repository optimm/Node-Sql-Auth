const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const Customer = require("../services/customerDbService");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthenticatedError("Authentication invalid"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.email || !payload.name) {
      next(new UnauthenticatedError("Authentication invalid"));
    }
    const user = new Customer({ email: payload.email, name: payload.name });
    const { data } = await user.getbyEmail();
    if (!data) {
      next(
        new UnauthenticatedError("Account does not exists or token is invalid")
      );
    }
    req.user = { email: payload.email, name: payload.name };
  } catch (error) {
    if (error.message && error.message === "jwt expired") {
      next(new UnauthenticatedError("Login session timed out"));
    }
    next(new UnauthenticatedError("Authentication invalid"));
  }
  next();
};

module.exports = auth;
