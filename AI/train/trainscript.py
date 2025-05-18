# %%
from roboflow import Roboflow
rf = Roboflow(api_key="Ob9mLrO3fKqDwCHJu04j")
project = rf.workspace("surfline").project("surfer-spotting")
version = project.version(2)
dataset = version.download("yolov11")

# %%
import os
from ultralytics import YOLO
import yaml 
EXISTING_DATA_YAML_PATH = "/home/user/Documents/ECE140/SurfWatch/AI/train/Surfer-Spotting-2/data.yaml"
PROJECT_NAME = "YOLOv11_Surfer_Spotting"

RUN_NAME = "yolov11m_finetune_gpu" 


MODEL_NAME = "yolo11m.pt" 
EPOCHS = 50 
BATCH_SIZE = 16 
IMG_SIZE = 640  
DEVICE = 0 

if not os.path.exists(EXISTING_DATA_YAML_PATH):
    print(f"Error: Cannot find data.yaml at: {EXISTING_DATA_YAML_PATH}")
    print("Please ensure the path is correct.")
    exit()
else:
    print(f"Using existing data configuration: {EXISTING_DATA_YAML_PATH}")


# %%
print(f"Loading pre-trained model: {MODEL_NAME}")
model = YOLO(MODEL_NAME)


# %%


print(f"Starting training on device: {DEVICE}...")
try:
    results = model.train(
        data=EXISTING_DATA_YAML_PATH, 
        epochs=EPOCHS,
        imgsz=IMG_SIZE,
        batch=BATCH_SIZE,
        project=PROJECT_NAME,
        name=RUN_NAME,
        device=DEVICE, 
    )
    print("Training finished.")
    print(f"Results saved to: {results.save_dir}")

except Exception as e:
    print(f"An error occurred during training: {e}")
    if "CUDA" in str(e):
        print(
            "A CUDA-related error occurred. Ensure CUDA is installed correctly, "
            "your NVIDIA drivers are up to date, and PyTorch with CUDA support is installed."
        )
        print(
            "You can check PyTorch CUDA availability with: python -c 'import torch; print(torch.cuda.is_available())'"
        )

#Eval
print(
    f"\nAttempting evaluation on the test set (if defined in YAML) using device: {DEVICE}..."
)
try:
   
    best_model_path = os.path.join(
        PROJECT_NAME, RUN_NAME, "weights", "best.pt"
    )
    if os.path.exists(best_model_path):
        print(f"Loading best weights from: {best_model_path}")
        model = YOLO(best_model_path)
        metrics = model.val(
            data=EXISTING_DATA_YAML_PATH, split="test", device=DEVICE
        )

        print("Test Set Evaluation Metrics:")

        print(f"  mAP50-95: {metrics.box.map:.4f}")
        print(f"  mAP50: {metrics.box.map50:.4f}")
        print(f"  mAP75: {metrics.box.map75:.4f}")
        
    else:
        print(
            f"Could not find best model weights at {best_model_path}. Skipping test set evaluation."
        )
except Exception as e:
    print(f"An error occurred during test set evaluation: {e}")
    print(
        "Ensure the 'test' key and path are correctly specified in your data.yaml if you want to evaluate."
    )


print("\nScript finished.")



