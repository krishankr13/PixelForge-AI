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
          data.message || "Caption generation failed"
        );
      }

      setCaption(data.caption);
      setStatus("Caption generated successfully! 🚀");
    } catch (error) {
      console.error("Caption generation error:", error);
      setStatus("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold">
          Image Caption Generator
        </h1>

        <p className="text-slate-400 mt-2">
          Upload an image and generate an AI-powered caption.
        </p>

        <div className="mt-8 border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center">

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block mx-auto text-sm"
          />

          {preview && (
            <div className="mt-6">
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 mx-auto rounded-xl object-contain"
              />
            </div>
          )}

        </div>

        {image && (
          <div className="mt-6 flex gap-3">

            <button
              onClick={generateCaption}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Generating..."
                : caption
                ? "🔄 Different Caption"
                : "Generate Caption"}
            </button>

          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-slate-400">
            {status}
          </p>
        )}

        {caption && (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <h2 className="text-lg font-semibold mb-2">
              AI Generated Caption
            </h2>

            <p className="text-slate-300 leading-relaxed">
              {caption}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default CaptionGenerator;