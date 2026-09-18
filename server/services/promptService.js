const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const enhancePrompt = async (prompt, style, ratio) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

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