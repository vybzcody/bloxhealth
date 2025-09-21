interface UploadProgressProps {
  progress: number;
  status: string;
  isUploading: boolean;
}

export const UploadProgress = ({ progress, status, isUploading }: UploadProgressProps) => {
  if (!isUploading && progress === 0) return null;

  return (
    <div style={{
      background: "white",
      border: "1px solid #eee",
      borderRadius: "12px",
      padding: "25px",
      margin: "20px 0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          background: "#e9ecef",
          borderRadius: "10px",
          height: "12px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            background: progress === 100 ? 
              "linear-gradient(135deg, #28a745 0%, #20c997 100%)" :
              "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.5s ease",
            borderRadius: "10px"
          }} />
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontSize: "0.9rem",
          color: "#666"
        }}>
          <span>Upload Progress</span>
          <span style={{ fontWeight: "bold" }}>{progress}%</span>
        </div>
      </div>
      
      {/* Status with Spinner */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#f8f9fa",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        {/* Loading Spinner */}
        {isUploading && progress < 100 && (
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid #e9ecef",
            borderTop: "2px solid #6b7280",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
        )}
        
        {/* Success Icon */}
        {progress === 100 && (
          <div style={{
            width: "20px",
            height: "20px",
            background: "#28a745",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold"
          }}>
            ✓
          </div>
        )}
        
        {/* Status Text */}
        <div style={{
          fontSize: "0.95rem",
          color: "#333",
          fontWeight: "500",
          flex: 1
        }}>
          {status}
        </div>
        
        {/* Progress Percentage */}
        <div style={{
          fontSize: "0.9rem",
          color: "#666",
          fontWeight: "bold",
          minWidth: "40px",
          textAlign: "right"
        }}>
          {progress}%
        </div>
      </div>

      {/* Detailed Progress Steps */}
      <div style={{
        marginTop: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "10px",
        fontSize: "0.8rem"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: progress >= 10 ? "#28a745" : "#6c757d"
        }}>
          <span>{progress >= 10 ? "✓" : "○"}</span>
          <span>Balance Check</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: progress >= 30 ? "#28a745" : "#6c757d"
        }}>
          <span>{progress >= 30 ? "✓" : "○"}</span>
          <span>Dataset Setup</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: progress >= 60 ? "#28a745" : "#6c757d"
        }}>
          <span>{progress >= 60 ? "✓" : "○"}</span>
          <span>File Upload</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: progress >= 85 ? "#28a745" : "#6c757d"
        }}>
          <span>{progress >= 85 ? "✓" : "○"}</span>
          <span>Blockchain</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: progress >= 100 ? "#28a745" : "#6c757d"
        }}>
          <span>{progress >= 100 ? "✓" : "○"}</span>
          <span>Complete</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
