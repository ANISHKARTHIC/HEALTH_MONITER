import requests
import json

# ---- YOUR FIREBASE DETAILS ----
DATABASE_URL = "https://health-moniter-soi-default-rtdb.asia-southeast1.firebasedatabase.app"
API_KEY = "AIzaSyDbk_2DYeG5r1mJWNZK32znd7VfHimknYs"

# ---- TEST DATA ----
data = {
    "Temperature": 37.2,
    "ECG": 512,
    "Status": "ONLINE_FROM_PYTHON"
}

print("Sending test data to Firebase...")

response = requests.put(
    f"{DATABASE_URL}/PythonTest.json",
    data=json.dumps(data)
)

print("Status Code:", response.status_code)
print("Response:", response.text)