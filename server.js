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

//extra security middlewares
const helemt = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimitter = require("express-rate-limit");

//databse imports
const connectDb = require("./db/connect");

//routers
const authRouter = require("./routes/auth-router");

app.set("trust proxy", 1);
app.use(
  rateLimitter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helemt());
app.use(cors());
app.use(xss());

//routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/auth", authRouter);

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
