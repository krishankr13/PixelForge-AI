const mongoose = require("mongoose");

const creationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    style: {
      type: String,
      default: "Realistic",
    },

    ratio: {
      type: String,
      default: "1:1",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Creation", creationSchema);