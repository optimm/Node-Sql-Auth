const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");

class Customer {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async save() {
    if (!this.name || !this.email || !this.password) {
      throw new BadRequestError(
        "Payload Invalid. Name, Email, Password Are All Required"
      );
    }

    const sql = "INSERT INTO customer (name,email,password) VALUES (?,?,?)";
    try {
      await this.hashPassword();
      const [userSave, _] = await db.query(sql, [
        this.name,
        this.email,
        this.password,
      ]);
      return {
        error: false,
        success: true,
        message: "User Registered Successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async Find(obj) {
    const fields = Object.keys(obj);
    const values = Object.values(obj);
    if (!fields || fields.length === 0 || !values || values.length === 0) {
      throw new BadRequestError("No field choosen for searching");
    }
    let fieldString = "";
    for (let index = 0; index < fields.length; index++) {
      fieldString +=
        index === fields.length - 1
          ? fields[index] + "=?"
          : fields[index] + "=? AND";
    }

    const sql = `SELECT name,email,verified FROM customer WHERE ${fieldString}`;
    console.log(fieldString, sql);
    try {
      const [[data], _] = await db.query(sql, [...values]);
      if (data) {
        this.email = data.email;
      }
      console.log("sads", data);
      return { error: false, success: true, data };
    } catch (error) {
      throw error;
    }
  }

  async getbyEmail() {
    const sql =
      "SELECT name,email,verified,verifyToken FROM customer WHERE email=?";
    try {
      const [[data], _] = await db.query(sql, [this.email]);
      return { error: false, success: true, data };
    } catch (error) {
      throw error;
    }
  }
  async login() {
    const sql = "SELECT * FROM customer WHERE email=?";
    try {
      const [[data], _] = await db.query(sql, [this.email]);
      if (!data) {
        throw new UnauthenticatedError(
          "No account is associated with this email"
        );
      }
      if (!data.verified) {
        throw new UnauthenticatedError("User not verified");
      }
      this.name = data.name;
      const ismatch = await this.matchPassword({
        originalPassword: data.password,
      });
      if (!ismatch) {
        throw new UnauthenticatedError("Incorrect password!");
      }
      const token = await this.generateToken();
      return { error: false, success: true, token };
    } catch (error) {
      throw error;
    }
  }

  async update(obj) {
    const fields = Object.keys(obj);
    const values = Object.values(obj);
    if (!fields || fields.length === 0 || !values || values.length === 0) {
      throw new BadRequestError("No field choosen for updating");
    }
    let fieldString = "";
    for (let index = 0; index < fields.length; index++) {
      fieldString +=
        index === fields.length - 1
          ? fields[index] + "=?"
          : fields[index] + "=?,";
    }
    const sql = `Update customer SET ${fieldString} WHERE email=?`;
    try {
      await db.query(sql, [...values, this.email]);
    } catch (error) {
      throw error;
    }
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async matchPassword({ originalPassword }) {
    const ismatch = await bcrypt.compare(this.password, originalPassword);
    return ismatch;
  }

  async generateToken() {
    return jwt.sign(
      { email: this.email, name: this.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  }
}

module.exports = Customer;
