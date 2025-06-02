import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from typing import List, Optional

# Create a directory to store uploaded files if it doesn't exist
UPLOAD_DIRECTORY = "uploaded_files"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

app = FastAPI()

@app.put("/cam")
async def upload_cam_data(
    image: UploadFile = File(...),
    video: UploadFile = File(...),
    # If you also want to test sending the 'data' JSON string as a form field:
    # data: Optional[str] = Form(None) # Or use a Pydantic model if it's complex JSON
):
    received_files_info = {}
    image_filename_on_server = ""
    video_filename_on_server = ""

    try:
        # --- Process Image ---
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image format for 'image' part.")

        image_filename_on_server = os.path.join(UPLOAD_DIRECTORY, image.filename)
        with open(image_filename_on_server, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        received_files_info["image"] = {
            "filename": image.filename,
            "content_type": image.content_type,
            "saved_path": image_filename_on_server
        }
        print(f"Received and saved image: {image_filename_on_server}")

        # --- Process Video ---
        if not video.content_type.startswith("video/"):
            raise HTTPException(status_code=400, detail="Invalid video format for 'video' part.")

        video_filename_on_server = os.path.join(UPLOAD_DIRECTORY, video.filename)
        with open(video_filename_on_server, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        received_files_info["video"] = {
            "filename": video.filename,
            "content_type": video.content_type,
            "saved_path": video_filename_on_server
        }
        print(f"Received and saved video: {video_filename_on_server}")

        # --- Process optional 'data' field ---
        # if data:
        #     try:
        #         import json
        #         json_data = json.loads(data)
        #         received_files_info["data_payload"] = json_data
        #         print(f"Received data payload: {json_data}")
        #     except json.JSONDecodeError:
        #         received_files_info["data_payload"] = "Could not decode JSON string"
        #         print(f"Received data string (not valid JSON): {data}")


        return JSONResponse(
            status_code=200,
            content={
                "message": "Files received successfully",
                "uploaded_files_details": received_files_info,
            },
        )

    except HTTPException as e:
        # Re-raise HTTPExceptions to let FastAPI handle them
        raise e
    except Exception as e:
        print(f"Error processing upload: {e}")
        # Clean up potentially partially saved files if an error occurs mid-process
        if os.path.exists(image_filename_on_server):
            os.remove(image_filename_on_server)
        if os.path.exists(video_filename_on_server):
            os.remove(video_filename_on_server)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        # Ensure file handles are closed
        if image and not image.file.closed:
            image.file.close()
        if video and not video.file.closed:
            video.file.close()

@app.get("/")
async def root():
    return {"message": "FastAPI server is running. Send PUT request to /cam to upload files."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")