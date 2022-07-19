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
    if (!data) {
      throw new UnauthenticatedError("Account Does Not Exists");
    }

    if (data.verified) {
      throw new BadRequestError("User Already Verified!");
    }

    const token = await bcrypt.hash(email, 10);
    await user.update({ verifyToken: token });

    const jwtToken = jwt.sign({ email: data.email }, process.env.JWT_SECRET, {
      expiresIn: "10s",
    });

    const url = `${process.env.FRONTEND_BASE_URL}/verify-user-email/${jwtToken}`;
    const message = `<h1>Hello Please Verify Your Email Here</h1><a href=${url} clickTracking=off>${url}</a>`;

    try {
      const emailUrl = await sendEmail({
        to: data.email,
        subject: "Email Verification",
        text: message,
      });
      res.status(StatusCodes.OK).json({
        error: false,
        success: true,
        message: "Verification Email Sent SuccessFully!",
        url: emailUrl,
      });
    } catch (error) {
      throw new CustomAPIError("Email could not be sent");
    }
  } catch (error) {
    await user.update({ verifyToken: null });
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      throw new UnauthenticatedError("Verification Failed On This Link");
    }
    const user = new Customer({ email: decoded.email });
    const { data } = await user.get();
    if (!data) {
      throw new UnauthenticatedError("Verification Failed On This Link");
    }
    if (data.verified) {
      throw new BadRequestError("User Already Verified");
    }
    await user.update({ verified: true, verifyToken: null });
    res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "User verified SuccessFully",
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

module.exports = { register, login, verifyEmail, sendVerificationMail };
