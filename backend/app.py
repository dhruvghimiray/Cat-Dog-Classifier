from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from utils import preprocess_image  # Import the helper function
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load the pre-trained model
model = load_model('models/cat_dog_classifier.model(90.01).h5')

# TEST ROUTE
@app.route('/test', methods=['GET'])
def test():
    return "Working"

# Define a prediction route
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    image = file.read()

    # Preprocess the image using the function from utils.py
    preprocessed_image = preprocess_image(image)

    # Make prediction
    predictions = model.predict(preprocessed_image)
    confidence = predictions[0][0]  # Confidence score for class "Cat"
    class_label = 'Cat' if confidence > 0.5 else 'Dog'

    # Adjust confidence for "Dog" if it is the predicted class
    if class_label == 'Dog':
        confidence = 1 - confidence

    return jsonify({
        'class': class_label,
        'confidence': round(float(confidence), 4)  # Round to 2 decimal places
    })

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
