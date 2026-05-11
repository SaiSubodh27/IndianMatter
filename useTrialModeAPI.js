/**
 * React Hook: useTrialModeAPI
 * =========================
 *
 * Hook for communicating with Trial Mode backend
 *
 * Usage:
 * ------
 * const { analyzeCif, loading, result, error } = useTrialModeAPI();
 *
 * // Upload and analyze CIF
 * const handleUpload = async (file) => {
 *   await analyzeCif(file, 'MyMaterial123');
 * };
 */

import { useState, useCallback } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const useTrialModeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");

  const analyzeCif = useCallback(async (file, materialId = null) => {
    setLoading(true);
    setError(null);
    setProgress("Connecting to backend...");

    try {
      // Validate file
      if (!file) {
        throw new Error("No file selected");
      }

      if (!file.name.toLowerCase().endsWith(".cif")) {
        throw new Error("Please upload a .cif file");
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      if (materialId) {
        formData.append("material_id", materialId);
      }

      // Send to backend
      setProgress("Uploading CIF file...");
      const response = await fetch(`${API_BASE_URL}/analyze-cif`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0] || "Backend error");
      }

      setProgress("Analysis complete!");
      setResult(data);
      return data;
    } catch (err) {
      const errorMsg = err.message || "Failed to analyze CIF";
      setError(errorMsg);
      setProgress("");
      console.error("Trial Mode API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLastResult = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/last-result`);
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      }
      return data;
    } catch (err) {
      console.error("Failed to get last result:", err);
      throw err;
    }
  }, []);

  const getErrorLog = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/error-log`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to get error log:", err);
      throw err;
    }
  }, []);

  const clearUploads = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clear-uploads`, {
        method: "POST",
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to clear uploads:", err);
      throw err;
    }
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Health check failed:", err);
      return { status: "error", error: err.message };
    }
  }, []);

  return {
    analyzeCif,
    getLastResult,
    getErrorLog,
    clearUploads,
    healthCheck,
    loading,
    result,
    error,
    progress,
  };
};

/**
 * REACT COMPONENT EXAMPLE
 * =======================
 *
 * import React, { useState } from 'react';
 * import { useTrialModeAPI } from './api/useTrialModeAPI';
 *
 * export function TrialModeUpload() {
 *   const { analyzeCif, loading, result, error, progress } = useTrialModeAPI();
 *   const [file, setFile] = useState(null);
 *   const [materialId, setMaterialId] = useState('');
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     if (file) {
 *       try {
 *         const data = await analyzeCif(file, materialId);
 *         console.log('Results:', data);
 *       } catch (err) {
 *         console.error('Analysis failed:', err);
 *       }
 *     }
 *   };
 *
 *   return (
 *     <div className="trial-mode-container">
 *       <form onSubmit={handleSubmit}>
 *         <input
 *           type="file"
 *           accept=".cif"
 *           onChange={(e) => setFile(e.target.files?.[0])}
 *           disabled={loading}
 *         />
 *         <input
 *           type="text"
 *           placeholder="Material ID (optional)"
 *           value={materialId}
 *           onChange={(e) => setMaterialId(e.target.value)}
 *           disabled={loading}
 *         />
 *         <button type="submit" disabled={loading || !file}>
 *           {loading ? `Analyzing... ${progress}` : 'Analyze CIF'}
 *         </button>
 *       </form>
 *
 *       {error && <div className="error">{error}</div>}
 *
 *       {result && (
 *         <div className="results">
 *           <h3>Analysis Results</h3>
 *           <pre>{JSON.stringify(result, null, 2)}</pre>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */

export default useTrialModeAPI;
