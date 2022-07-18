const db = require("../db/db");
const { BadRequestError } = require("../errors");

class Customer {
  constructor() {}

  async save({ name, email, password }) {
    console.log("hulalal", name, email, password);
    if (!name || !email || !password) {
      throw new BadRequestError("Name, email, password are all required");
    }
    if (email === "" || password === "" || name === "") {
      throw new BadRequestError("Name, email, password cannot be empty");
    }

    const sql = "INSERT INTO customer (name,email,password) VALUES (?,?,?)";
    try {
      const [userSave, _] = await db.query(sql, [name, email, password]);
      return { success: true, message: "User Registered Successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Customer;
