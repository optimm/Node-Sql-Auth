const mysql = require("mysql2");
const db = require("./db");
const { CustomAPIError } = require("../errors");

const connectDb = async () => {
  try {
    await db.connect();
  } catch (error) {
    throw new CustomAPIError("Could Not Connect To Server");
  }
  console.log("Connected to Server..");
};

module.exports = connectDb;
