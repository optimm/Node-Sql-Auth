const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
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

const sendVerificationMail = async (req, res, next) => {
  const { email } = req.body;
  const user = new Customer({ email });
  try {
    const { data } = await user.get();

    if (data.verified) {
      throw new BadRequestError("User Already Verified!");
    }

    const url = "http://localhost:5000";
    const message = `<h1>Hello Please Verify Your Email Here</h1><a href=${url} clickTracking=off>${url}</a>`;

    try {
      await sendEmail({
        to: data.email,
        subject: "Email Verification",
        text: message,
      });
    } catch (error) {
      console.log(error);
      throw new CustomAPIError("Email Could Not be Sent");
    }
    console.log("bello");

    res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "Verification Email Sent SuccessFully!",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.body;
  try {
    await user.update({ verified: true });
  } catch (error) {}
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

module.exports = { register, login, verifyEmail, sendVerificationMail };
