const CLOUDFLARE_API_URL =
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run`;

const MODEL =
  "@cf/black-forest-labs/flux-2-klein-9b";

// -----------------------------------
// Cloudflare AI Request
// -----------------------------------

const callCloudflareAI = async (formData) => {
  const response = await fetch(
    `${CLOUDFLARE_API_URL}/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Cloudflare AI Error (${response.status}): ${errorText}`
    );
  }

  return response.json();
};

// -----------------------------------
// Text → Image
// -----------------------------------

const generateImage = async (prompt) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const formData = new FormData();

  formData.append("prompt", prompt.trim());
  formData.append("width", "1024");
  formData.append("height", "1024");

  const result = await callCloudflareAI(formData);

  if (!result?.result?.image) {
    throw new Error(
      "Cloudflare did not return an image"
    );
  }

  return Buffer.from(
    result.result.image,
    "base64"
  );
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

  // Node.js Buffer → Blob
  const imageBlob = new Blob(
    [image],
    {
      type: "image/png",
    }
  );

  const formData = new FormData();

  formData.append(
    "input_image_0",
    imageBlob,
    "input.png"
  );

  formData.append(
    "prompt",
    prompt.trim()
  );

  formData.append(
    "width",
    "1024"
  );

  formData.append(
    "height",
    "1024"
  );

  const result =
    await callCloudflareAI(formData);

  if (!result?.result?.image) {
    throw new Error(
      "Cloudflare did not return a remixed image"
    );
  }

  return Buffer.from(
    result.result.image,
    "base64"
  );
};

// -----------------------------------
// Export
// -----------------------------------

module.exports = {
  generateImage,
  remixImage,
};