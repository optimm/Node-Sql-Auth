const express = require("express");

const router = express.Router();

const {
  AddtoCart,
  DeleteFromCart,
  GetCart,
  ClearCart,
} = require("../controllers/cart-controller");

router.route("/add-to-cart").post(AddtoCart);
router.route("/delete-from-cart").post(DeleteFromCart);
router.route("/get-cart").get(GetCart);
router.route("/clear-cart").post(ClearCart);

module.exports = router;
