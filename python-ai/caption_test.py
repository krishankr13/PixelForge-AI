from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

MODEL_NAME = "Salesforce/blip-image-captioning-base"

print("Loading BLIP model...")

processor = BlipProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)

print("BLIP model loaded successfully 🚀")

image_path = input("Enter image path: ").strip()

image = Image.open(str(image_path)).convert("RGB")

inputs = processor(images=image, return_tensors="pt")

output = model.generate(**inputs, max_new_tokens=30)

caption = processor.decode(output[0], skip_special_tokens=True)

print("\nAI Generated Caption:")
print(caption)