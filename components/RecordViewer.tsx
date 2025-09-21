import { useState } from "react";
import { useRecordRetrieval } from "@/hooks/useRecordRetrieval";

interface RecordViewerProps {
  pieceCid: string;
  fileName: string;
  encrypted: boolean;
  onClose: () => void;
}

export const RecordViewer = ({ pieceCid, fileName, encrypted, onClose }: RecordViewerProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { retrieveMutation, retrievedData, downloadRecord } = useRecordRetrieval();

  const handleView = async () => {
    await retrieveMutation.mutateAsync({ 
      pieceCid, 
      password: encrypted ? password : undefined 
    });
  };

  const handleDownload = () => {
    downloadRecord(fileName);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "30px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h2 style={{ margin: 0, color: "#333" }}>📄 View Medical Record</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#666", margin: "5px 0" }}>
            <strong>File:</strong> {fileName}
          </p>
          <p style={{ color: "#666", margin: "5px 0" }}>
            <strong>CID:</strong> {pieceCid.slice(0, 20)}...
          </p>
          <p style={{ color: "#666", margin: "5px 0" }}>
            <strong>Encrypted:</strong> {encrypted ? "Yes" : "No"}
          </p>
        </div>

        {encrypted && !retrievedData && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              🔐 Enter decryption password:
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px"
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  cursor: "pointer"
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {!retrievedData ? (
            <button
              onClick={handleView}
              disabled={retrieveMutation.isPending || (encrypted && !password)}
              style={{
                flex: 1,
                padding: "12px",
                background: (!retrieveMutation.isPending && (!encrypted || password)) ? 
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: (!retrieveMutation.isPending && (!encrypted || password)) ? "pointer" : "not-allowed",
                fontWeight: "bold"
              }}
            >
              {retrieveMutation.isPending ? "🔄 Retrieving..." : "📄 View Record"}
            </button>
          ) : (
            <>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                💾 Download
              </button>
              <button
                onClick={() => window.open(URL.createObjectURL(retrievedData))}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                🔍 Open
              </button>
            </>
          )}
        </div>

        {retrieveMutation.error && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "15px",
            color: "#dc2626"
          }}>
            <strong>❌ Error:</strong> {retrieveMutation.error.message}
          </div>
        )}

        {retrievedData && (
          <div style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "15px",
            color: "#0ea5e9"
          }}>
            <strong>✅ Success:</strong> Medical record retrieved successfully via FilCDN!
          </div>
        )}
      </div>
    </div>
  );
};
