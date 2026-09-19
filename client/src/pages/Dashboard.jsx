import { useEffect, useState } from "react";
import CaptionGenerator from "./CaptionGenerator";
import ImageToPrompt from "./ImageToPrompt";

function Dashboard() {
  const [mode, setMode] = useState("create");

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [ratio, setRatio] = useState("1:1");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] =
    useState(true);

  const styles = [
    "Realistic",
    "Cinematic",
    "Anime",
    "3D",
    "Digital Art",
    "Fantasy",
  ];

  const ratios = ["1:1", "16:9", "9:16"];

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // Fetch saved creations
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoadingHistory(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/creation/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch history"
          );
        }

        setHistory(data.creations || []);
      } catch (error) {
        console.error(
          "History error:",
          error
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  // Generate Image
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setError("");
      setGeneratedImage("");
      setSaved(false);

      const finalPrompt = `${prompt.trim()}, ${style} style, highly detailed, beautiful composition, cinematic lighting`;

      const response = await fetch(
        "http://localhost:5000/api/image/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: finalPrompt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Image generation failed"
        );
      }

      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error(
        "Image generation error:",
        error
      );

      setError(
        error.message ||
          "Failed to generate image. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Creation
  const handleSave = async () => {
    if (!generatedImage) return;

    try {
      setIsSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again to save your creation."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/creation/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt,
            style,
            ratio,
            imageUrl: generatedImage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save creation"
        );
      }

      setSaved(true);

      if (data.creation) {
        setHistory((prev) => [
          data.creation,
          ...prev,
        ]);
      }

      alert(
        "Creation saved successfully! 🚀"
      );
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      setError(
        error.message ||
          "Failed to save creation"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Download current image
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(
        generatedImage
      );

      const blob = await response.blob();

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "pixelforge-ai-image.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      setError(
        "Failed to download image."
      );
    }
  };

  // Download history image
  const handleHistoryDownload = async (
    imageUrl,
    index
  ) => {
    try {
      const response = await fetch(
        imageUrl
      );

      const blob =
        await response.blob();

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `pixelforge-history-${
        index + 1
      }.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "History download error:",
        error
      );

      setError(
        "Failed to download saved image."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#0c0c12]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 font-bold">
              P
            </div>

            <h1 className="text-lg font-bold">
              PixelForge{" "}
              <span className="text-purple-400">
                AI
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user.name || "Creator"}
              </p>

              <p className="text-xs text-gray-500">
                {user.email || ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm font-medium text-purple-400">
            AI CREATIVE STUDIO
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Welcome back,{" "}
            {user.name || "Creator"} 👋
          </h2>

          <p className="mt-2 text-gray-500">
            Create, understand and explore
            your visual ideas with AI.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setError("");
            }}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              mode === "create"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            🎨 Create Image
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("caption");
              setError("");
            }}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              mode === "caption"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            🖼️ Image → Caption
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("image-to-prompt");
              setError("");
            }}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              mode === "image-to-prompt"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            🧠 Image → Prompt
          </button>
        </div>

        {/* ========================= */}
        {/* CREATE IMAGE MODE */}
        {/* ========================= */}

        {mode === "create" && (
          <>
            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-500">
                  Images Generated
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {generatedImage ? "1" : "0"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-500">
                  Saved Creations
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {history.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-500">
                  AI Credits
                </p>

                <p className="mt-2 text-2xl font-bold">
                  Free
                </p>
              </div>
            </div>

            {/* Generator */}
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              {/* Controls */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">
                    Create Image
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Describe what you want to create.
                  </p>
                </div>

                {/* Prompt */}
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Prompt
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.target.value)
                  }
                  placeholder="A futuristic city at sunset..."
                  className="h-36 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
                />

                {/* Prompt Enhancer */}
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border border-purple-500/30 bg-purple-500/5 px-4 py-2 text-sm text-purple-300 transition hover:bg-purple-500/10"
                >
                  ✨ Enhance Prompt with AI
                </button>

                {/* Style */}
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Style
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setStyle(item)
                        }
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          style === item
                            ? "border-purple-500 bg-purple-500/15 text-purple-300"
                            : "border-white/10 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ratio */}
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Aspect Ratio
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {ratios.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setRatio(item)
                        }
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          ratio === item
                            ? "border-purple-500 bg-purple-500/15 text-purple-300"
                            : "border-white/10 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate */}
                <button
                  onClick={handleGenerate}
                  disabled={
                    !prompt.trim() ||
                    isGenerating
                  }
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 font-semibold transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isGenerating
                    ? "Generating..."
                    : "✨ Generate Image"}
                </button>

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
              </section>

              {/* Preview */}
              <section className="flex min-h-[560px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                {/* Empty */}
                {!isGenerating &&
                  !generatedImage &&
                  !error && (
                    <div className="text-center">
                      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-4xl">
                        ✨
                      </div>

                      <h3 className="text-xl font-semibold">
                        Start creating
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Enter a prompt to generate
                        your first image.
                      </p>
                    </div>
                  )}

                {/* Loading */}
                {isGenerating && (
                  <div className="text-center">
                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />

                    <h3 className="font-semibold">
                      Creating your image...
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      AI is working on your creation.
                    </p>
                  </div>
                )}

                {/* Generated Image */}
                {!isGenerating &&
                  generatedImage && (
                    <div className="w-full max-w-2xl">
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                        <img
                          src={generatedImage}
                          alt="AI Generated"
                          className="h-auto w-full object-contain"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {/* Save */}
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={
                            isSaving || saved
                          }
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving
                            ? "Saving..."
                            : saved
                            ? "✓ Saved"
                            : "♡ Save"}
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          onClick={
                            handleDownload
                          }
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5"
                        >
                          ↓ Download
                        </button>
                      </div>

                      <p className="mt-3 text-center text-xs text-gray-600">
                        {style} · {ratio}
                      </p>
                    </div>
                  )}

                {/* Error Preview */}
                {!isGenerating &&
                  !generatedImage &&
                  error && (
                    <div className="text-center">
                      <div className="mb-4 text-5xl">
                        ⚠️
                      </div>

                      <h3 className="font-semibold">
                        Generation failed
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Check the backend terminal
                        for more details.
                      </p>
                    </div>
                  )}
              </section>
            </div>

            {/* History */}
            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    Creation History
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Your saved AI-generated creations.
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400">
                  {history.length}{" "}
                  {history.length === 1
                    ? "Creation"
                    : "Creations"}
                </span>
              </div>

              {/* History Loading */}
              {isLoadingHistory && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />

                  <p className="text-sm text-gray-500">
                    Loading your creations...
                  </p>
                </div>
              )}

              {/* Empty History */}
              {!isLoadingHistory &&
                history.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                    <div className="mb-4 text-4xl">
                      🎨
                    </div>

                    <h4 className="font-semibold">
                      No saved creations yet
                    </h4>

                    <p className="mt-2 text-sm text-gray-500">
                      Generate an image and save it
                      to see it here.
                    </p>
                  </div>
                )}

              {/* History Grid */}
              {!isLoadingHistory &&
                history.length > 0 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {history.map(
                      (creation, index) => (
                        <div
                          key={
                            creation._id ||
                            `${creation.imageUrl}-${index}`
                          }
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-purple-500/30"
                        >
                          {/* Image */}
                          <div className="aspect-video overflow-hidden bg-black">
                            <img
                              src={
                                creation.imageUrl
                              }
                              alt={
                                creation.prompt ||
                                "Saved creation"
                              }
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          </div>

                          {/* Details */}
                          <div className="p-4">
                            <p className="line-clamp-2 text-sm text-gray-300">
                              {creation.prompt}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-xs text-purple-300">
                                {creation.style}
                              </span>

                              <span className="text-xs text-gray-500">
                                {creation.ratio}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleHistoryDownload(
                                  creation.imageUrl,
                                  index
                                )
                              }
                              className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
                            >
                              ↓ Download
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </section>
          </>
        )}

        {/* ========================= */}
        {/* IMAGE → CAPTION MODE */}
        {/* ========================= */}

        {mode === "caption" && (
          <div className="mx-auto max-w-4xl">
            <CaptionGenerator />
          </div>
        )}

        {/* ========================= */}
        {/* IMAGE → PROMPT MODE */}
        {/* ========================= */}

        {mode === "image-to-prompt" && (
          <div className="mx-auto max-w-4xl">
            <ImageToPrompt />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;