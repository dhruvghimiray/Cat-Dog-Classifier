import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      // Reset prediction and error when a new image is uploaded
      setPrediction(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
      setPrediction(null);
    }
  };

  const getPredictionMessage = () => {
    if (!prediction) return "";

    const confidence = prediction.confidence * 100;

    if (confidence < 60) {
      return `Not sure, but it seems like ${prediction.class}.`;
    }

    if (prediction.class === "Dog") {
      return "It's a dog! 🐶";
    }

    if (prediction.class === "Cat") {
      return "It's a cat! 😺";
    }

    return `It's a ${prediction.class}.`; // Fallback for unexpected classes
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-100">
          Cat vs Dog Prediction
        </h1>
        <div className="space-y-2">
          <label className="block text-gray-400 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full border border-gray-600 rounded-lg p-2 text-sm bg-gray-700 text-gray-100"
          />
        </div>
        {preview && (
          <div className="mt-4">
            <h2 className="text-gray-400 text-sm font-medium">Image Preview:</h2>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-md mt-2 shadow"
            />
          </div>
        )}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Predict
        </button>
        {prediction && (
          <div className="mt-4 p-4 bg-green-700 text-green-100 rounded-md">
            <h2 className="font-bold">Prediction:</h2>
            
            <p>{getPredictionMessage()}</p>
            <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-700 text-red-100 rounded-md">
            <h2 className="font-bold">Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
