# PixelForge AI 🎨

PixelForge AI is an AI-powered creative studio for generating, analyzing, remixing, and managing AI-generated images.

## ✨ Features

- 🔐 User registration and JWT authentication
- 📝 Text-to-image generation
- 🖼️ Image caption generation
- 🧠 Image-to-prompt generation
- 🎨 AI image remix / similar image generation
- 💾 Save creations to personal history
- 📜 Persistent creation history with MongoDB
- 📥 Download generated images
- 📋 Copy generated prompts

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

### AI
- Hugging Face Inference API
- Stable Diffusion XL
- FLUX.1-Kontext
- Salesforce BLIP

## 🏗️ Architecture

```text
User
  │
  ▼
React Frontend
  │
  ├── Authentication ──► Express API ──► MongoDB
  │
  ├── Text → Image ────► Hugging Face
  │
  ├── Image → Caption ─► Python + BLIP
  │
  ├── Image → Prompt ──► Python + BLIP
  │
  └── Image → Remix ───► Express + Hugging Face