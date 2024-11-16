import numpy as np
import cv2

SIZE = 200  # Image size required by the model

def preprocess_image(image_bytes):
    """
    Preprocess the input image bytes for model prediction.
    Args:
        image_bytes (bytes): Raw image bytes.
    Returns:
        np.ndarray: Preprocessed image ready for model input.
    """
    # Convert the image bytes to a numpy array
    image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_GRAYSCALE)
    # Resize the image to the required input size of the model
    image = cv2.resize(image, (SIZE, SIZE))  # Adjust size to match your model
    # Normalize pixel values
    image = image / 255.0
    # Add batch dimension
    image = np.expand_dims(image, axis=0)
    return image
