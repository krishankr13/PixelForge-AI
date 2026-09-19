import { useState } from "react";

function CaptionGenerator() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setCaption("");
    setStatus("");
  };

  const generateCaption = async () => {
    if (!image) {
      setStatus("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setCaption("");
      setStatus("AI is analyzing your image...");

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://127.0.0.1:8000/caption",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Caption generation failed"
        );
      }

      setCaption(data.caption);
      setStatus(
        "Caption generated successfully! 🚀"
      );
    } catch (error) {
      console.error(
        "Caption generation error:",
        error
      );

      setStatus(
        "Failed to generate caption. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-purple-400">
          UNDERSTAND YOUR IMAGE
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Image → Caption
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Upload an image and let AI describe
          what it sees.
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
            <img
              src={preview}
              alt="Uploaded preview"
              className="mx-auto max-h-80 rounded-xl object-contain"
            />
          </div>
        )}
      </div>

      {/* Generate */}
      {image && (
        <button
          type="button"
          onClick={generateCaption}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Analyzing Image..."
            : caption
            ? "🔄 Generate Different Caption"
            : "✨ Generate Caption"}
        </button>
      )}

      {/* Status */}
      {status && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {status}
        </p>
      )}

      {/* Caption */}
      {caption && (
        <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            AI Generated Caption
          </p>

          <p className="mt-3 leading-relaxed text-gray-300">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}

export default CaptionGenerator;