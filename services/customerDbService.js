const db = require("../db/db");
const { BadRequestError, UnauthenticatedError } = require("../errors");

class Customer {
  constructor() {}

  async save({ name, email, password }) {
    if (!name || !email || !password) {
      throw new BadRequestError("Name, Email, Password Are All Required");
    }
    if (email === "" || password === "" || name === "") {
      throw new BadRequestError("Name, Email, Password Cannot Be Empty");
    }

    const sql = "INSERT INTO customer (name,email,password) VALUES (?,?,?)";
    try {
      const [userSave, _] = await db.query(sql, [name, email, password]);
      return {
        error: false,
        success: true,
        message: "User Registered Successfully",
      };
    } catch (error) {
      throw error;
    }
  }
  async get({ email }) {
    const sql = "SELECT * FROM customer WHERE email=?";
    try {
      const [userData, _] = await db.query(sql, [email]);
      if (!userData || userData.length === 0) {
        throw new UnauthenticatedError(
          "Invalid Credentials, Please Check Email"
        );
      }
      return { error: false, success: true, data: userData };
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    const sql = "SELECT * FROM customer WHERE email=?";
    try {
      const [[data], _] = await db.query(sql, [email]);
      if (!data) {
        throw new UnauthenticatedError(
          "Invalid Credentials, Please Check Email"
        );
      }
      if (data.password !== password) {
        throw new UnauthenticatedError("Incorrect Password!");
      }
      return { error: false, success: true, data };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Customer;
