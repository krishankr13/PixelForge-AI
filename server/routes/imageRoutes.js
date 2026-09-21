const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const {
  generateImage,
  remixImage,
} = require("../services/imageService");

const router = express.Router();

// -----------------------------------
// Multer configuration
// -----------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// -----------------------------------
// Text → Image
// -----------------------------------

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const image = await generateImage(prompt);

    // Cloudflare service returns a Buffer
    const buffer = image;

    const uploadsDir = path.join(
      __dirname,
      "../uploads"
    );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {
        recursive: true,
      });
    }

    const fileName = `generated-${crypto.randomUUID()}.png`;

    const filePath = path.join(
      uploadsDir,
      fileName
    );

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `http://localhost:${
      process.env.PORT || 5000
    }/uploads/${fileName}`;

    console.log("Image saved:", fileName);

    res.json({
      message: "Image generated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error(
      "Image Generation Error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to generate image",
      error: error.message,
    });
  }
});

// -----------------------------------
// Image → Image / Remix
// -----------------------------------

router.post(
  "/remix",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      const { prompt } = req.body;

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({
          message: "Prompt is required",
        });
      }

      console.log(
        "Starting image remix..."
      );

      const image = await remixImage(
        req.file.buffer,
        prompt
      );

      // Cloudflare service returns a Buffer
      const buffer = image;

      const uploadsDir = path.join(
        __dirname,
        "../uploads"
      );

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, {
          recursive: true,
        });
      }

      const fileName = `remix-${crypto.randomUUID()}.png`;

      const filePath = path.join(
        uploadsDir,
        fileName
      );

      fs.writeFileSync(
        filePath,
        buffer
      );

      const imageUrl = `http://localhost:${
        process.env.PORT || 5000
      }/uploads/${fileName}`;

      console.log(
        "Remixed image saved:",
        fileName
      );

      res.json({
        message:
          "Image remixed successfully",
        imageUrl,
      });
    } catch (error) {
      console.error(
        "Image Remix Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to remix image",
        error: error.message,
      });
    }
  }
);

module.exports = router;