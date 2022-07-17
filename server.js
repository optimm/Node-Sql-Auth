require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

//built in middeware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// error handler middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//databse imports
const connectDb = require("./db/connect");

//routes
app.get("/", (req, res) => {
  res.send("Hello");
});

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server for jobs is running on port ${port} `);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
