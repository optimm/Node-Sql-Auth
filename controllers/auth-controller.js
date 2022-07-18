const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../services/customerDbService");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new Customer({ name, email, password });
  try {
    const { error, success, message } = await user.save();
    res.status(StatusCodes.CREATED).json({ error, success, message });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = new Customer({ email, password });
  try {
    const { error, success, token } = await user.login();
    res.status(StatusCodes.OK).json({ error, success, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
