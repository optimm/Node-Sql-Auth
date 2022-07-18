const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../services/customerDbService");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new Customer();
  try {
    await user.save({ name, email, password });
    res.status(StatusCodes.CREATED).json({ msg: "register" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "login" });
};

module.exports = { register, login };
