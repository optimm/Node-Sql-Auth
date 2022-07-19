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

const AddtoCart = async (req, res, next) => {
  res.send("Add to cart");
};

const DeleteFromCart = async (req, res, next) => {
  res.send("del from cart");
};

const GetCart = async (req, res, next) => {
  const { email, name } = req.user;
  res.send(`get cart ${email} , ${name}`);
};

const ClearCart = async (req, res, next) => {
  res.send("clear cart");
};

module.exports = { AddtoCart, DeleteFromCart, GetCart, ClearCart };
