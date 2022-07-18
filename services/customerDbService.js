const db = require("../db/db");
const { BadRequestError } = require("../errors");

class Customer {
  constructor() {}

  async save({ name, email, password }) {
    console.log("hulalal", name, email, password);
    if (
      !name ||
      !email ||
      !password ||
      email === "" ||
      password === "" ||
      name === ""
    ) {
      throw new BadRequestError("Please Provide Complete User Register Data!");
    }

    const sql = "INSERT INTO customer (name,email,pass) VALUES (?,?,?)";
    try {
      const [userSave, _] = await db.query(sql, [name, email, password]);
      return { success: true, message: "User Created Successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Customer;
