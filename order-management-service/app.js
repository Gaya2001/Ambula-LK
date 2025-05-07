require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes.js");

const app = express();

// Middleware
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json());

// app.js
app.use("/orders", orderRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Order Service running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
