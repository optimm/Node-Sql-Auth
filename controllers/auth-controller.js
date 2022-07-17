const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ msg: "register" });
};

const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "login" });
};

module.exports = { register, login };
