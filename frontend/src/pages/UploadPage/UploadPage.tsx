import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import "./UploadPage.css";

const API_URL = import.meta.env.VITE_API_URL as string;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    const user = JSON.parse(localStorage.getItem("currentUser")!);
    const userId = user.userId;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/users/${userId}/transactions/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      localStorage.setItem("hasData", "true");
      navigate("/dashboard");
    } catch (err) {
      alert("Upload failed. Check CSV format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="user-main">
        <div className="upload-page">
          <div className="upload-card">
            <div className="upload-icon-wrapper">
              <FiUpload className="upload-icon" />
            </div>

            <h2 className="upload-title">Upload your bank statement</h2>
            <p className="upload-description">
              Upload a CSV file exported from your bank.
              We’ll automatically categorize and analyze your expenses.
            </p>

            {/* CUSTOM FILE PICKER */}
            <div
              className={`upload-dropzone ${file ? "has-file" : ""}`}
              onClick={() =>
                document.getElementById("csv-input")?.click()
              }
            >
              <FiUpload className="dropzone-icon" />

              {!file ? (
                <>
                  <p className="dropzone-title">
                    Click to select CSV file
                  </p>
                  <span className="dropzone-subtitle">
                    or drag & drop it here
                  </span>
                </>
              ) : (
                <>
                  <p className="dropzone-title">Selected file</p>
                  <span className="dropzone-file">{file.name}</span>
                </>
              )}

              <input
                id="csv-input"
                type="file"
                accept=".csv"
                hidden
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
            </div>

            <button
              className="primary-button"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>
          </div>
        </div>
      </div>

      <div className="user-right" />
    </>
  );
}
