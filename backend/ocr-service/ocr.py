import sys
import json
import pytesseract
import cv2

image_url = sys.argv[1]

image = cv2.imread(image_url)

# fallback for cloudinary URL
if image is None:
    import urllib.request
    import numpy as np

    resp = urllib.request.urlopen(image_url)
    image_array = np.asarray(bytearray(resp.read()), dtype=np.uint8)
    image = cv2.imdecode(image_array, -1)

text = pytesseract.image_to_string(image)

amount = None
import re
match = re.search(r"(\d+\.\d{2})", text)
if match:
    amount = match.group(1)

result = {
    "title": "OCR Expense",
    "amount": float(amount) if amount else 0,
    "date": "2025-01-01",
    "raw_text": text
}

print(json.dumps(result))
