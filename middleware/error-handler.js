const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("error bawa", err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong please try again later",
  };

  if (err.code && err.code === "ER_DUP_ENTRY") {
    customError.message = "This email is already associated with an account";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res
    .status(customError.statusCode)
    .json({ success: false, message: customError.message });
};

module.exports = errorHandlerMiddleware;
