import { useState } from "react";

function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [ratio, setRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    "Realistic",
    "Cinematic",
    "Anime",
    "3D",
    "Digital Art",
    "Fantasy",
  ];

  const ratios = ["1:1", "16:9", "9:16"];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Temporary simulation.
    // Real AI generation will be connected later.
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

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
              PixelForge <span className="text-purple-400">AI</span>
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
            Welcome back, {user.name || "Creator"} 👋
          </h2>

          <p className="mt-2 text-gray-500">
            Turn your ideas into stunning AI-generated artwork.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Images Generated</p>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Saved Creations</p>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">AI Credits</p>
            <p className="mt-2 text-2xl font-bold">Free</p>
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
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city at sunset..."
              className="h-36 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
            />

            {/* Enhance Prompt */}
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
                    onClick={() => setStyle(item)}
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
                    onClick={() => setRatio(item)}
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
              disabled={!prompt.trim() || isGenerating}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 font-semibold transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating
                ? "Generating..."
                : "✨ Generate Image"}
            </button>
          </section>

          {/* Preview */}
          <section className="flex min-h-[560px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            {!isGenerating && !prompt.trim() && (
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-4xl">
                  ✨
                </div>

                <h3 className="text-xl font-semibold">
                  Start creating
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Enter a prompt to generate your first image.
                </p>
              </div>
            )}

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

            {!isGenerating && prompt.trim() && (
              <div className="w-full max-w-xl">
                <div className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-[#11111a] to-pink-950/30 p-8">
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10">
                    <div className="text-center">
                      <div className="mb-4 text-5xl">
                        🖼️
                      </div>

                      <h3 className="font-semibold">
                        Image Preview
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {style} · {ratio}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Real AI generation will be connected next.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">
                    ♡ Save
                  </button>

                  <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">
                    ↓ Download
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;