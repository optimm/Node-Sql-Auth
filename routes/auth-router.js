const express = require("express");

const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  sendVerificationMail,
} = require("../controllers/auth-controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/send-verification-mail").post(sendVerificationMail);
router.route("/verify-email/:token").get(verifyEmail);

module.exports = router;
