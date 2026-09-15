function App() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          PixelForge AI
        </h1>

        <p className="mt-5 text-gray-400 text-lg">
          AI Powered Text-to-Image Generator
        </p>

        <button className="mt-8 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition">
          Generate Image
        </button>
      </div>
    </div>
  )
}

export default App