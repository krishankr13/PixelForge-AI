const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const promptRoutes = require("./routes/promptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/prompt", promptRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "PixelForge AI Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully 🚀");

    app.listen(PORT, () => {
      console.log(`PixelForge AI server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
  });