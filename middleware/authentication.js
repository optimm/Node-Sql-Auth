const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const Customer = require("../services/customerDbService");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.email || !payload.name) {
      throw new UnauthenticatedError("Authentication Invalid");
    }
    const user = new Customer({ email: payload.email, name: payload.name });
    const { data } = user.get().catch((err) => {
    });

    req.user = { email: payload.email, name: payload.name };
    console.log("i was in auth", payload.name);
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  next();
};

module.exports = auth;
