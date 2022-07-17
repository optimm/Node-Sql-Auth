// get the client
const mysql = require("mysql2");

// create connection;
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

module.exports = connection.promise();
