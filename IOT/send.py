from utils import record, take_photo_at_resolution, send_data

if __name__ == "__main__":
    video_path = "demo.mp4"
    image_path = "test1.jpg"
    send_data(
        image_path=image_path,
        video_path=video_path,
    )