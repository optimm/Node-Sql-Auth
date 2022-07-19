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

const verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = new Customer({ email });
  try {
    const { data } = await user.get();
    if (data.verified) {
      throw new BadRequestError("User Already Verified!");
    }
    await user.update({ verified: true });
    res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "User Verified Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = new Customer({ email });

  try {
    const { data } = await user.get();
    if (!data.verified) {
      throw new UnauthenticatedError("User Not Verified");
    }
    
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, verifyEmail };
