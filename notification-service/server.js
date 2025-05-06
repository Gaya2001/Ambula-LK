require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(express.json());

app.use("/notify", notificationRoutes);

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Notification Service MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed", err));