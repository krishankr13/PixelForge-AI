const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

// -----------------------------------
// Text → Image
// -----------------------------------

const generateImage = async (prompt) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const image = await client.textToImage({
    provider: "auto",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: prompt.trim(),
  });

  return image;
};

// -----------------------------------
// Image → Image / Remix
// -----------------------------------

const remixImage = async (image, prompt) => {
  if (!image) {
    throw new Error("Input image is required");
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  // Convert Node.js Buffer → Blob
  const imageBlob = new Blob([image]);

  const result = await client.imageToImage({
    provider: "auto",
    model: "black-forest-labs/FLUX.1-Kontext-dev",
    inputs: imageBlob,
    parameters: {
      prompt: prompt.trim(),
    },
  });

  return result;
};

// -----------------------------------
// Export
// -----------------------------------

module.exports = {
  generateImage,
  remixImage,
};