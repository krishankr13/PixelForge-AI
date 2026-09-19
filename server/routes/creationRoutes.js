const express = require("express");
const jwt = require("jsonwebtoken");
const Creation = require("../models/Creation");

const router = express.Router();

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId || decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Save creation
router.post("/save", authenticateUser, async (req, res) => {
  try {
    const {
      prompt,
      style,
      ratio,
      imageUrl,
    } = req.body;

    if (!prompt || !imageUrl) {
      return res.status(400).json({
        message: "Prompt and image are required",
      });
    }

    const creation = await Creation.create({
      user: req.userId,
      prompt,
      style,
      ratio,
      imageUrl,
    });

    res.status(201).json({
      message: "Creation saved successfully",
      creation,
    });
  } catch (error) {
    console.error("Save Creation Error:", error.message);

    res.status(500).json({
      message: "Failed to save creation",
    });
  }
});

// Get user's creations
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const creations = await Creation.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      creations,
    });
  } catch (error) {
    console.error("History Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch history",
    });
  }S
});

module.exports = router;