const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("error handler me aagerele", err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something Went Wrong Please Try Again Later",
  };

  if (err.code && err.code === "ER_DUP_ENTRY") {
    customError.message = "This Email Is Already Associated With An Account";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.code && err.code === "ER_PARSE_ERROR") {
    customError.message = `Invalid Sql Query : ${err.sql}`;
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  } else if (err.code && err.code === "ER_BAD_FIELD_ERROR") {
    customError.message = `${err.sqlMessage} , Invalid Sql Query : ${err.sql}`;
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  } else if (err.code && err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
    customError.message = `Invalid Payload`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.message && err.message === "jwt expired") {
    customError.message = `This Link Has Expired`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res
    .status(customError.statusCode)
    .json({ error: true, success: false, message: customError.message });
};

module.exports = errorHandlerMiddleware;
