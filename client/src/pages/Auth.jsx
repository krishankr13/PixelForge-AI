import { useState } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setMessage("Login successful 🎉");
      } else {
        setMessage("Account created successfully 🎉");

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080c] px-4 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold">
            P
          </div>

          <h1 className="text-3xl font-bold">
            PixelForge <span className="text-purple-400">AI</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create amazing AI-generated images
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-black/30 p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
              className={`rounded-lg py-2.5 text-sm font-medium transition ${
                isLogin
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
              className={`rounded-lg py-2.5 text-sm font-medium transition ${
                !isLogin
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isLogin
                ? "Login to continue creating."
                : "Start creating with PixelForge AI."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-500"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to use PixelForge AI responsibly.
        </p>
      </div>
    </div>
  );
}

export default Auth;