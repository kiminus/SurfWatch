from utils import record, take_photo_at_resolution, send_data

if __name__ == "__main__":
    video_path = record(
        duration_seconds=10,
    )
    image_path = take_photo_at_resolution()
    send_data(
        image_path=image_path,
        video_path=video_path,
        server_addr="agrishakov.com"
    )