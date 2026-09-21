import { useState } from "react";

function ImageToPrompt() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [generatedPrompt, setGeneratedPrompt] =
    useState("");
  const [remixedImage, setRemixedImage] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [remixing, setRemixing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setGeneratedPrompt("");
    setRemixedImage("");
    setSaved(false);
    setStatus("");
  };

  // -----------------------------------
  // Image → Prompt
  // -----------------------------------

  const generatePrompt = async () => {
    if (!image) {
      setStatus("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setGeneratedPrompt("");
      setRemixedImage("");
      setSaved(false);
      setStatus("AI is analyzing your image...");

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        `${import.meta.env.VITE_PYTHON_API_URL || "http://127.0.0.1:8000"}/image-to-prompt`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate prompt"
        );
      }

      setGeneratedPrompt(data.prompt);

      setStatus(
        "Prompt generated successfully! 🚀"
      );
    } catch (error) {
      console.error(
        "Image-to-Prompt error:",
        error
      );

      setStatus(
        "Failed to generate prompt. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Copy Prompt
  // -----------------------------------

  const copyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(
        generatedPrompt
      );

      setStatus(
        "Prompt copied to clipboard! 📋"
      );
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );

      setStatus("Failed to copy prompt.");
    }
  };

  // -----------------------------------
  // Image → Image / Remix
  // -----------------------------------

  const generateSimilarImage = async () => {
    if (!image || !generatedPrompt) {
      return;
    }

    try {
      setRemixing(true);
      setRemixedImage("");
      setSaved(false);

      setStatus(
        "Creating a similar image from your original... 🎨"
      );

      const formData = new FormData();

      formData.append("image", image);

      formData.append(
        "prompt",
        `Create a visually similar variation of the input image. Preserve the main subject, pose, composition, camera angle and overall visual context. Keep the important characteristics of the original image while creating a new high-quality result.

${generatedPrompt}`
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/image/remix`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Image remix failed"
        );
      }

      setRemixedImage(data.imageUrl);

      setStatus(
        "Similar image generated successfully! 🚀"
      );
    } catch (error) {
      console.error(
        "Image remix error:",
        error
      );

      setStatus(
        error.message ||
          "Failed to generate similar image."
      );
    } finally {
      setRemixing(false);
    }
  };

  // -----------------------------------
  // Save Remix
  // -----------------------------------

  const saveRemix = async () => {
    if (!remixedImage) return;

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again to save your remix."
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/creation/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt:
              generatedPrompt ||
              "AI Remixed Image",
            style: "AI Remix",
            ratio: "Original",
            imageUrl: remixedImage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save remix"
        );
      }

      setSaved(true);

      setStatus(
        "Remix saved to your creation history! 🚀"
      );
    } catch (error) {
      console.error(
        "Save Remix error:",
        error
      );

      setStatus(
        error.message ||
          "Failed to save remix."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {/* Header */}

      <div className="mb-6">
        <p className="text-sm font-medium text-purple-400">
          REVERSE ENGINEER
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Image → Prompt → Remix
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Analyze an image, generate a prompt,
          and create a visually similar variation.
        </p>
      </div>

      {/* Upload */}

      <div className="rounded-xl border-2 border-dashed border-white/10 bg-black/20 p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mx-auto block text-sm text-gray-400"
        />

        {preview && (
          <div className="mt-6">
            <p className="mb-3 text-xs text-gray-500">
              Original Image
            </p>

            <img
              src={preview}
              alt="Uploaded preview"
              className="mx-auto max-h-80 rounded-xl object-contain"
            />
          </div>
        )}
      </div>

      {/* Generate Prompt */}

      {image && (
        <button
          type="button"
          onClick={generatePrompt}
          disabled={loading || remixing}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Analyzing Image..."
            : generatedPrompt
            ? "🔄 Generate Again"
            : "🧠 Generate Prompt"}
        </button>
      )}

      {/* Status */}

      {status && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {status}
        </p>
      )}

      {/* Generated Prompt */}

      {generatedPrompt && (
        <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              AI Generated Prompt
            </p>

            <button
              type="button"
              onClick={copyPrompt}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              📋 Copy
            </button>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300">
            {generatedPrompt}
          </p>

          {/* Remix */}

          <button
            type="button"
            onClick={generateSimilarImage}
            disabled={remixing}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {remixing
              ? "🎨 Creating Similar Image..."
              : "✨ Generate Similar Image"}
          </button>
        </div>
      )}

      {/* Remixed Image */}

      {remixedImage && (
        <div className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              AI Remix
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              Similar Image
            </h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img
              src={remixedImage}
              alt="AI Remixed"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Save + Download */}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={saveRemix}
              disabled={saving || saved}
              className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : saved
                ? "✓ Saved"
                : "♡ Save Remix"}
            </button>

            <a
              href={remixedImage}
              download="pixelforge-remix.png"
              className="rounded-xl border border-white/10 px-6 py-3 text-center font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              ↓ Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageToPrompt;