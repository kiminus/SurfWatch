import requests
import json
from datetime import datetime, timezone
SERVER_IP = "localhost" 
SERVER_PORT = 8000
ENDPOINT_URL = f"http://{SERVER_IP}:{SERVER_PORT}/cam"

IMAGE_PATH = r"D:\Coding\ECE140\SurfWatch\IOT\captures\test.jpg"
CROWDEDNESS = 100

def create_payload_data(crowdedness: int):
    """Creates the JSON payload for RawCrowdnessReading"""
    return {
        "time": datetime.now(timezone.utc).isoformat(), 
        "site_id": 1,
        "crowdness": crowdedness
    }

def main():
    payload_dict = create_payload_data(crowdedness=CROWDEDNESS)
    payload_json_string = json.dumps(payload_dict)
    files_to_upload = {
        'image': (IMAGE_FILENAME, open(IMAGE_PATH, 'rb'), "image/jpeg"),
        'data': (None, payload_json_string)
    }
    try:
        response = requests.put(ENDPOINT_URL, files=files_to_upload)

        print(f"\nResponse Status Code: {response.status_code}")
        try:
            print("Response JSON:")
            print(response.json())
        except requests.exceptions.JSONDecodeError:
            print("Response Content (not JSON):")
            print(response.text)

        if response.status_code == 200 or response.status_code == 201:
            print("\nData and image uploaded ")
        else:
            print("\nUpload failed.")

    except requests.exceptions.ConnectionError as e:
        print(f"\nConnection Error: Could not connect to the server at {ENDPOINT_URL}")
    except Exception as e:
        print(f"\nAn error occurred: {e}")