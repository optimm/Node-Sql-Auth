const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");

//dependencies
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");
//database service
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
    const { data } = await user.getbyEmail();
    if (!data) {
      throw new UnauthenticatedError(
        "No account is associated with this email"
      );
    }

    if (data.verified) {
      throw new BadRequestError("User already verified!");
    }

    const token = uuidv4();

    await user.update({ verifyToken: token });

    const jwtToken = jwt.sign(
      { email, verifyToken: token },
      process.env.JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );

    const url = `${process.env.FRONTEND_VERIFY_EMAIL_URL}/${jwtToken}`;
    const message = `<h1>Hello please follow this link to verify your email</h1><a href=${url} clickTracking=off>${url}</a><br><b>This link is valid for 10 minutes only<b>`;

    try {
      const emailUrl = await sendEmail({
        to: data.email,
        subject: "Email Verification",
        text: message,
      });
      res.status(StatusCodes.OK).json({
        error: false,
        success: true,
        message: "Verification email sent successFully!",
        token: jwtToken,
        emailUrl,
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
  const { token } = req.params;

  try {
    if (!token) throw new CustomAPIError("Error");
    const { email, verifyToken } = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken || !email) {
      throw new CustomAPIError("Error");
    }

    const user = new Customer({ email });
    const { data } = await user.getbyEmail();
    if (!data) {
      throw new CustomAPIError("Error");
    }
    if (data.verified) {
      next(new BadRequestError("User already verified"));
    }
    if (data.verifyToken !== verifyToken) {
      throw new CustomAPIError("Error");
    }

    await user.update({ verified: true, verifyToken: null });
    res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "user verified successFully",
    });
  } catch (error) {
    if (error.message && error.message === "jwt expired") {
      next(error);
    } else {
      next(new BadRequestError("Invalid Request, please check the link"));
    }
  }
};

const forgotPasswordEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = new Customer({ email });
  try {
    const { data } = await user.getbyEmail();
    if (!data) {
      throw new UnauthenticatedError(
        "No account is associated with this email"
      );
    }

    const token = uuidv4();
    await user.update({ forgotPasswordToken: token });
    const jwtToken = jwt.sign(
      { email, forgotPasswordToken: token },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const url = `${process.env.FRONTEND_PASSWORD_RESET_URL}/${jwtToken}`;
    const message = `<h1>Hello please follow this link to reset your password</h1><a href=${url} clickTracking=off>${url}</a><br><br><b>This link is valid for 10 minutes only<b>`;
    try {
      const emailUrl = await sendEmail({
        to: data.email,
        subject: "Reset Your Password",
        text: message,
      });
      res.status(StatusCodes.OK).json({
        error: false,
        success: true,
        message: "Email Sent Successfully",
        token: jwtToken,
        emailUrl,
      });
    } catch (error) {
      throw new CustomAPIError("Email could not be sent");
    }
  } catch (error) {
    await user.update({ forgotPasswordToken: null });
    next(error);
  }
};

const ResetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    if (!token) throw new CustomAPIError("Error");

    const { email, forgotPasswordToken } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    if (!forgotPasswordToken || !email) {
      throw new CustomAPIError("Error");
    }

    const user = new Customer({ email });
    const { data } = await user.getbyEmail();
    if (!data) {
      throw new CustomAPIError("Error");
    }
    console.log(data.forgotPasswordToken);
    if (data.forgotPasswordToken !== forgotPasswordToken) {
      throw new CustomAPIError("Error");
    }
    user.password = password;
    await user.hashPassword();
    await user.update({ password: user.password, forgotPasswordToken: null });

    res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "Password was reset successfully",
    });
  } catch (error) {
    if (error.message && error.message === "jwt expired") {
      next(error);
    } else {
      next(new BadRequestError("Invalid Request, please check the link"));
    }
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  sendVerificationMail,
  forgotPasswordEmail,
  ResetPassword,
};
