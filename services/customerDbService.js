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
      throw new BadRequestError("Name, Email, Password Are All Required");
    }
    if (this.email === "" || this.password === "" || this.name === "") {
      throw new BadRequestError("Name, Email, Password Cannot Be Empty");
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

  async get() {
    const sql = "SELECT * FROM customer WHERE email=?";
    try {
      const [userData, _] = await db.query(sql, [this.email]);
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
  async login() {
    const sql = "SELECT * FROM customer WHERE email=?";
    try {
      const [[data], _] = await db.query(sql, [this.email]);
      if (!data) {
        throw new UnauthenticatedError(
          "Invalid Credentials, Please Check Email"
        );
      }
      this.name = data.name;
      const ismatch = await this.matchPassword({
        originalPassword: data.password,
      });
      if (!ismatch) {
        throw new UnauthenticatedError("Incorrect Password!");
      }
      const token = await this.generateToken();
      return { error: false, success: true, token };
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
