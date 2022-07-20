const express = require("express");

const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  sendVerificationMail,
  forgotPasswordEmail,
  ResetPassword,
} = require("../controllers/auth-controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/send-verification-mail").post(sendVerificationMail);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/send-forgot-password-email").post(forgotPasswordEmail);
router.route("/reset-password/:token").post(ResetPassword);

module.exports = router;
