const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../services/customerDbService");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new Customer();
  try {
    const saveRes = await user.save({ name, email, password });
    res
      .status(StatusCodes.CREATED)
      .json({ success: saveRes.success, message: saveRes.success });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "login" });
};

module.exports = { register, login };
