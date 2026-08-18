// Model Integration Script for Stitch UI
const API_URL = "http://localhost:5000";

// DOM Elements
const dropZone = document.getElementById("dropZone");
const cifInput = document.getElementById("cifInput");
const predictBtn = document.getElementById("predictBtn");
const uploadStatus = document.getElementById("uploadStatus");
const tempSlider = document.getElementById("tempSlider");
const tempValue = document.getElementById("tempValue");

// Display value elements
const conductivityDisplay = document.getElementById("conductivityValue");
const eaDisplay = document.getElementById("eaValue");
const eaChangeDisplay = document.getElementById("eaChange");
const preExpDisplay = document.getElementById("preExpValue");
const ionicCondDisplay = document.getElementById("ionicCondValue");

let currentFile = null;
let currentResults = null;

// File Upload Handling
if (dropZone) {
  dropZone.addEventListener("click", () => cifInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--primary)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "var(--outline-variant)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--outline-variant)";
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });
}

if (cifInput) {
  cifInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFileSelect(e.target.files[0]);
    }
  });
}

function handleFileSelect(file) {
  if (!file.name.toLowerCase().endsWith(".cif")) {
    uploadStatus.textContent = "Error: Please upload a .cif file";
    uploadStatus.style.color = "#ffb4ab";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    uploadStatus.textContent = "Error: File too large (max 10MB)";
    uploadStatus.style.color = "#ffb4ab";
    return;
  }

  currentFile = file;
  uploadStatus.textContent = `Loaded: ${file.name}`;
  uploadStatus.style.color = "#c3f5ff";
  predictBtn.disabled = false;
}

// Temperature Slider
if (tempSlider) {
  tempSlider.addEventListener("input", (e) => {
    tempValue.textContent = e.target.value;
    if (currentResults) {
      predictWithTemperature(parseFloat(e.target.value));
    }
  });
}

// Predict Button
if (predictBtn) {
  predictBtn.addEventListener("click", async () => {
    if (!currentFile) {
      uploadStatus.textContent = "Error: No file selected";
      uploadStatus.style.color = "#ffb4ab";
      return;
    }

    await submitPrediction();
  });
}

async function submitPrediction() {
  predictBtn.disabled = true;
  predictBtn.textContent = "Predicting...";
  uploadStatus.textContent = "Running model inference...";
  uploadStatus.style.color = "#c3f5ff";

  try {
    const formData = new FormData();
    formData.append("file", currentFile);
    formData.append("temperature", tempSlider.value);

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      currentResults = data;
      displayResults(data);
      uploadStatus.textContent = `✓ Success: ${data.formula}`;
      uploadStatus.style.color = "#00e5ff";
      predictBtn.textContent = "Re-Predict";
    } else {
      throw new Error(data.error || "Prediction failed");
    }
  } catch (error) {
    console.error("Prediction error:", error);
    uploadStatus.textContent = `Error: ${error.message}`;
    uploadStatus.style.color = "#ffb4ab";
  } finally {
    predictBtn.disabled = false;
  }
}

function displayResults(data) {
  // Convert conductivity to mS/cm
  const conductivity = data.conductivity * 1000;
  const conductivitySI = data.conductivity;

  // Update displays
  if (conductivityDisplay) {
    conductivityDisplay.textContent = conductivity.toFixed(2);
  }
  if (eaDisplay) {
    eaDisplay.textContent = data.ea.toFixed(3);
  }
  if (eaChangeDisplay) {
    const baselineEa = 0.35;
    const change = (((data.ea - baselineEa) / baselineEa) * 100).toFixed(1);
    eaChangeDisplay.textContent = Math.abs(change);
  }
  if (preExpDisplay) {
    preExpDisplay.textContent = Math.log10(
      data.conductivity * Math.exp(data.ea / (8.617e-5 * 298.15)),
    ).toFixed(2);
  }
  if (ionicCondDisplay) {
    ionicCondDisplay.textContent = conductivitySI.toExponential(2);
  }

  // Update needle rotation based on conductivity (0-2 mS/cm scale)
  updateNeedle(Math.min(conductivity / 2, 1));
}

function updateNeedle(normalizedValue) {
  const needle = document.querySelector(
    ".absolute.bottom-0.left-1\\/2.w-1.h-32",
  );
  if (needle) {
    // Rotate from 45 degrees (0) to 135 degrees (1)
    const rotation = 45 + normalizedValue * 90;
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
  }
}

async function predictWithTemperature(temp) {
  if (!currentFile) return;

  try {
    const formData = new FormData();
    formData.append("file", currentFile);
    formData.append("temperature", temp);

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        displayResults(data);
      }
    }
  } catch (error) {
    console.error("Temperature update error:", error);
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  uploadStatus.textContent = "Ready to upload CIF file";
  uploadStatus.style.color = "#bac9cc";
});
