const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const Customer = require("../services/customerDbService");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthenticatedError("Authentication Invalid"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.email || !payload.name) {
      next(
        new UnauthenticatedError("Authentication Invalid, Token Not Verified")
      );
    }
    const user = new Customer({ email: payload.email, name: payload.name });
    const { data } = await user.get();
    if (!data) {
      next(new UnauthenticatedError("Account Does Not Exists"));
    }
    req.user = { email: payload.email, name: payload.name };
  } catch (error) {
    next(new UnauthenticatedError("Authentication Invalid"));
  }
  next();
};

module.exports = auth;
