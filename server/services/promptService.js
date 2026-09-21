const OpenAI = require("openai");

const enhancePrompt = async (prompt, style, ratio) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  // OpenAI is optional.
  // If no API key is configured, don't crash the server.
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "AI prompt enhancement is currently unavailable."
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: `
You are an expert AI image-generation prompt engineer.

Improve the user's image idea into a detailed, high-quality prompt.

User idea:
${prompt.trim()}

Style:
${style || "Realistic"}

Aspect ratio:
${ratio || "1:1"}

Rules:
- Preserve the user's original subject and intent.
- Add useful details about composition, lighting, environment, mood, camera perspective and visual quality.
- Do not introduce unrelated subjects.
- Return ONLY the final image-generation prompt.
`,
  });

  return response.output_text.trim();
};

module.exports = {
  enhancePrompt,
};