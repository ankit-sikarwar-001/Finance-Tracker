import pytesseract
from PIL import Image
import sys
import re
import json
from datetime import datetime
from io import BytesIO
try:
    # Prefer stdlib to avoid extra dependency: urllib to fetch remote images
    import urllib.request as _urlreq
except Exception:
    _urlreq = None


def open_image(path_or_url):
    """Open a local file path or fetch a remote URL and open as PIL Image."""
    # Remote URL
    if isinstance(path_or_url, str) and path_or_url.lower().startswith(("http://", "https://")):
        if not _urlreq:
            raise RuntimeError("urllib.request not available to fetch remote images")
        resp = _urlreq.urlopen(path_or_url)
        data = resp.read()
        return Image.open(BytesIO(data))
    # Local path
    return Image.open(path_or_url)


path = None
try:
    path = sys.argv[1]
except Exception:
    # will be handled below
    pass

try:
    if not path:
        raise ValueError("No image path provided")
    image = open_image(path)
    text = pytesseract.image_to_string(image)
except Exception as e:
    # On error, print valid JSON so the caller won't get a JSON parse error.
    err = {"error": str(e)}
    print(json.dumps(err))
    sys.exit(1)

# Try to extract total amount by keywords
total_patterns = [
    r"total\s*[:\-]?\s*\$?\s*(\d+\.\d{2})",
    r"total\s+amount\s*[:\-]?\s*\$?\s*(\d+\.\d{2})",
    r"new\s+charges\s*[:\-]?\s*\$?\s*(\d+\.\d{2})",
    r"your\s+total\s+\w+\s*charges\s*[:\-]?\s*\$?\s*(\d+\.\d{2})",
    r"total\s+for\s+service\s*\d*[:\-]?\s*\$?\s*(\d+\.\d{2})"
]

amount_value = 0
for pattern in total_patterns:
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        amount_value = float(match.group(1))
        break

# If still not found → fallback to MAX value (usually total)
if amount_value == 0:
    all_numbers = re.findall(r"\d+\.\d{2}", text)
    if all_numbers:
        amount_value = float(max(all_numbers, key=lambda x: float(x)))  # biggest = total

# Extract merchant
lines = text.split("\n")
merchant = lines[0].strip() if lines else "Unknown"

# Categorize
def categorize(text):
    text = text.lower()
    if "food" in text or "restaurant" in text:
        return "Food"
    elif "uber" in text or "taxi" in text or "fuel" in text:
        return "Travel"
    elif "medical" in text or "pharmacy" in text:
        return "Medicine"
    elif "electric" in text or "water" in text or "energy" in text:
        return "Utilities"
    else:
        return "Others"

category = categorize(text)

result = {
    "merchant": merchant,
    "amount": amount_value,
    "category": category,
    "date": datetime.today().strftime("%Y-%m-%d")
}

print(json.dumps(result))
