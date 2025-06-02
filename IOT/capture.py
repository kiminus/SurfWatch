# %%
import cv2
import time
import os

# %%
def record(
    duration_seconds=20,
    camera_index=0,
    output_dir_original="video",
    video_filename_prefix="video"
):
   
    if not os.path.exists(output_dir_original):
        try:
            os.makedirs(output_dir_original)
            print(f"Created directory for originals: {output_dir_original}")
        except OSError as e:
            print(f"Error creating directory {output_dir_original}: {e}")
            return None

    cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    if cap.set(cv2.CAP_PROP_AUTOFOCUS, 1):
        print("set autofocus")
    print(cap.get(cv2.CAP_PROP_FPS))
    print(int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))


    timestamp = time.strftime("%Y%m%d_%H%M%S")
    original_video_filename = (
        f"{video_filename_prefix}_{timestamp}.mp4"
    )
    original_video_filepath = os.path.join(
        output_dir_original, original_video_filename
    )

    fourcc = cv2.VideoWriter_fourcc(*"mp4v") 
    out_original = cv2.VideoWriter(
        original_video_filepath, fourcc, 10, (1280, 720)
    )

    if not out_original.isOpened():
        print(f"Error: Could not open video writer for {original_video_filepath}")
        cap.release()
        return None

    print(f"Recording original video for {duration_seconds} seconds...")
    start_time = time.time()
    frames_written = 0

    while (time.time() - start_time) < duration_seconds:
        ret, frame = cap.read()
        if not ret:
            print("Error: Can't receive frame from camera.")
            break
        out_original.write(frame)
        frames_written += 1
    
    elapsed_time = time.time() - start_time
    print(f"Original recording finished. Duration: {elapsed_time:.2f}s. Frames: {frames_written}")

    cap.release()
    out_original.release()
    cv2.destroyAllWindows()

    if frames_written == 0:
        print("Error: No frames written to original video.")
        if os.path.exists(original_video_filepath): os.remove(original_video_filepath)
        return None
    return original_video_filepath
    
# %%
def take_photo_at_resolution(
    prefix="image",
    output_dir="image",
    camera_index=0,
    desired_width=2560,
    desired_height=1440,
):
    """
    Captures a single photo from the specified camera 
    """
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            print(f"Created directory for originals: {output_dir}")
        except OSError as e:
            print(f"Error creating directory {output_dir}: {e}")
            return None
    filename = f"{prefix}_{time.strftime('%Y%m%d_%H%M%S')}.jpg"
    filepath = os.path.join(
        output_dir, filename
    )
    cap = cv2.VideoCapture(camera_index, cv2.CAP_V4L2)

    if not cap.isOpened():
        print(f"Error: Could not open video device at index {camera_index}.")
        return False
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

    # Verify the resolution
    actual_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    actual_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"Actual resolution set by camera: {actual_width}x{actual_height}")

    if actual_width != desired_width or actual_height != desired_height:
        print(
            f"Warning: Camera did not use the exact desired resolution. "
            f"Using {actual_width}x{actual_height}."
        )

    if cap.set(cv2.CAP_PROP_AUTOFOCUS, 1):
        print("Autofocus enabled")
    else:
        print("Could not enable autofocus")

    print("Waiting for focus/exposure")
    time.sleep(5)
    for _ in range(5):
        ret, _ = cap.read() 
        if not ret:
            print("Warning: Could not read a preparatory frame.")
            break
        time.sleep(0.5) 

    print("Capturing final image...")
    ret, frame = cap.read()
    cap.release()
    print("Camera released.")

    if ret and frame is not None:
        try:
            cv2.imwrite(filepath, frame)
            print(f"Photo successfully saved as {filepath}")
            return filepath
        except Exception as e:
            print(f"Error: Could not save photo {filepath}. Reason: {e}")
            return None
    else:
        print("Error: Could not capture frame. 'ret' was False or frame was None.")
        return None