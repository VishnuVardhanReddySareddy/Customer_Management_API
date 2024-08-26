require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("server Connected"))
  .catch((err) => console.error(err.msg));
const app = express();

app.use(express.json());

const customerRouter = require("./routes/customers");

app.use("/customers", customerRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT, () =>
  console.log(`Server Started on ${process.env.PORT}`)
);
