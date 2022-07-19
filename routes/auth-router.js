const express = require("express");

const router = express.Router();

const {
  register,
  login,
  verifyEmail,
} = require("../controllers/auth-controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyemail").post(verifyEmail);

module.exports = router;
