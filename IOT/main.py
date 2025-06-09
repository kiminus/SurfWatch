# %%
from capture import record, take_photo_at_resolution
from rec import send_data

# %%
# video_path = record(
#     duration_seconds=2,
# )
# image_path = take_photo_at_resolution()
video_path = "test2.mp4"
image_path = "test1.jpg"
send_data(
    image_path=image_path,
    video_path=video_path,
    server_addr="127.0.0.1"
)
