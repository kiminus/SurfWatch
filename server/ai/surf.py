from ultralytics import YOLO
from PIL import Image
import math
from datetime import datetime
from models.site import RawCrowdnessReading
def split_image_into_tiles(
    image_path, 
    tile_size=(320, 320),
    padding_color=(255, 255, 255)
):
    try:
        
        img = Image.open(image_path)
    except Exception as e:
        print(f"Error: Image file not found at {image_path}")
        return []

    original_width, original_height = img.size
    tile_w, tile_h = tile_size

    effective_padding_color = padding_color

    padded_width = math.ceil(original_width / tile_w) * tile_w
    padded_height = math.ceil(original_height / tile_h) * tile_h

    padded_img = Image.new(
        img.mode, (padded_width, padded_height), effective_padding_color
    )

    padded_img.paste(img, (0, 0))

    tiles = []
    for y_offset in range(0, padded_height, tile_h):
        for x_offset in range(0, padded_width, tile_w):
            box = (x_offset, y_offset, x_offset + tile_w, y_offset + tile_h)
            tile = padded_img.crop(box)
            tiles.append(tile)
    return tiles



def calculate_surfers(image_path, model_path = "/app/server/best.pt"):
    try:
        model = YOLO(model_path)
    except Exception as e:
        print(f"Error with loading model: {e}")
    
    tiles = split_image_into_tiles(image_path=image_path)
    num_surf = 0
    for img in tiles:
        results = model(source=img, save=False, conf=0.2, device='cpu', imgsz=320)
        num_surf += len(results[0].boxes.conf)
    return num_surf
