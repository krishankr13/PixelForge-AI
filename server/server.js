const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const promptRoutes = require("./routes/promptRoutes");
const imageRoutes = require("./routes/imageRoutes");
const creationRoutes = require("./routes/creationRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pixel-forge-ai-gamma.vercel.app",
  ],
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

app.use(express.json());

// Serve generated images
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/prompt", promptRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/creation", creationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "PixelForge AI Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected Successfully 🚀"
    );

    app.listen(PORT, () => {
      console.log(
        `PixelForge AI server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Failed ❌"
    );

    console.error(error.message);
  });