from flask import Flask, request, jsonify
from flask_cors import CORS

from transformers import (
    BlipProcessor,
    BlipForConditionalGeneration
)

from PIL import Image


app = Flask(__name__)
CORS(app)

MODEL_NAME = "Salesforce/blip-image-captioning-base"

print("Loading BLIP model...")

processor = BlipProcessor.from_pretrained(MODEL_NAME)

model = BlipForConditionalGeneration.from_pretrained(
    MODEL_NAME
)

print("BLIP model loaded successfully 🚀")


# -----------------------------------
# Image → Caption
# -----------------------------------

@app.route("/caption", methods=["POST"])
def generate_caption():

    try:
        if "image" not in request.files:
            return jsonify({
                "message": "Image is required"
            }), 400

        image_file = request.files["image"]

        image = Image.open(
            image_file
        ).convert("RGB")

        inputs = processor(
            images=image,
            return_tensors="pt"
        )

        output = model.generate(
            **inputs,
            max_new_tokens=30,
            do_sample=True,
            temperature=0.9,
            top_p=0.9
        )

        caption = processor.decode(
            output[0],
            skip_special_tokens=True
        )

        return jsonify({
            "caption": caption
        })

    except Exception as error:

        print("Caption Error:", error)

        return jsonify({
            "message": "Failed to generate caption"
        }), 500


# -----------------------------------
# Image → Prompt
# -----------------------------------

@app.route("/image-to-prompt", methods=["POST"])
def image_to_prompt():

    try:

        if "image" not in request.files:
            return jsonify({
                "message": "Image is required"
            }), 400

        image_file = request.files["image"]

        image = Image.open(
            image_file
        ).convert("RGB")

        # Analyze image using BLIP
        inputs = processor(
            images=image,
            return_tensors="pt"
        )

        output = model.generate(
            **inputs,
            max_new_tokens=40,
            do_sample=True,
            temperature=0.8,
            top_p=0.9
        )

        caption = processor.decode(
            output[0],
            skip_special_tokens=True
        )

        # Convert caption into an image-generation prompt
        prompt = f"""
Create a high-quality image based on the following visual description:

{caption}

Visual requirements:
- Preserve the main subject and overall composition.
- Add realistic environmental details.
- Use appropriate cinematic lighting.
- Include natural colors and atmospheric depth.
- Add suitable camera perspective.
- Maintain the original mood and visual context.
- Make the scene highly detailed and visually appealing.
- Do not introduce unrelated subjects.
- The final result should look like a professional AI-generated artwork.
""".strip()

        return jsonify({
            "caption": caption,
            "prompt": prompt
        })

    except Exception as error:

        print(
            "Image-to-Prompt Error:",
            error
        )

        return jsonify({
            "message": "Failed to generate prompt"
        }), 500


# -----------------------------------
# Home
# -----------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "PixelForge AI Caption API is running 🚀"
    })


# -----------------------------------
# Start server
# -----------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )