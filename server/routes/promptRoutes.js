const express = require("express");
const { enhancePrompt } = require("../services/promptService");

const router = express.Router();

router.post("/enhance", async (req, res) => {
  try {
    const { prompt, style, ratio } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const enhancedPrompt = await enhancePrompt(
      prompt,
      style || "Realistic",
      ratio || "1:1"
    );

    res.json({
      message: "Prompt enhanced successfully",
      originalPrompt: prompt,
      enhancedPrompt,
    });
  } catch (error) {
    console.error("Prompt Enhancement Error:", error.message);

    res.status(500).json({
      message: "Failed to enhance prompt",
    });
  }
});

module.exports = router;