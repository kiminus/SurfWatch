import requests
import json
import os

def send_data(
        image_path,
        video_path,
        server_addr = "agrishakov.com",
):

    ENDPOINT_URL = f"https://{server_addr}/cam" 

    try:
        with open(image_path, 'rb') as image_file, \
            open(video_path, 'rb') as video_file:
            image_filename_for_server = os.path.basename(image_path)
            video_filename_for_server = os.path.basename(video_path)

            files_for_request = {
                'image': (image_filename_for_server, image_file, "image/jpeg"),
                'video': (video_filename_for_server, video_file, "video/mp4"),
            }

            response = requests.put(ENDPOINT_URL, files=files_for_request)

            print(f"\nResponse Status Code: {response.status_code}")
            try:
                print("Response JSON:")
                print(response.json())
            except requests.exceptions.JSONDecodeError:
                print("Response Content (not JSON):")
                print(response.text)

            if response.status_code == 200 or response.status_code == 201:
                print("\nImage and video uploaded successfully.")
            else:
                print("\nUpload failed.")

    except FileNotFoundError as e:
        print(f"\nError: File not found. Please check the paths.")
        print(e)
    except requests.exceptions.ConnectionError as e:
        print(f"\nError: Could not connect to the server at {ENDPOINT_URL}.")
        print(e)
    except requests.exceptions.RequestException as e:
        print(f"\nAn error occurred during the request:")
        print(e)
    except Exception as e:
        print(f"\nAn unexpected error occurred:")
        print(e)