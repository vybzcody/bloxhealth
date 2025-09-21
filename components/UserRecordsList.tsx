import { useState } from "react";
import { useUserRecords } from "@/hooks/useUserRecords";
import { RecordViewer } from "./RecordViewer";

interface UserRecord {
  id: number;
  fileName: string;
  pieceCid: string;
  uploadDate: string;
  encrypted: boolean;
  fileSize: number;
  owner: string;
}

export const UserRecordsList = () => {
  const { data: records = [], isLoading, error } = useUserRecords();
  const [selectedRecord, setSelectedRecord] = useState<UserRecord | null>(null);

  if (isLoading) {
    return (
      <div style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        margin: "20px 0"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "15px" }}>⏳</div>
        <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>Loading Records...</h3>
        <p style={{ color: "#666", margin: 0 }}>
          Fetching your medical records from the blockchain...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        margin: "20px 0"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "15px" }}>❌</div>
        <h3 style={{ color: "#dc2626", margin: "0 0 10px 0" }}>Error Loading Records</h3>
        <p style={{ color: "#dc2626", margin: 0 }}>
          Failed to fetch records from blockchain. Please try again.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        margin: "20px 0"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📁</div>
        <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>No Medical Records Yet</h3>
        <p style={{ color: "#666", margin: 0 }}>
          Upload your first medical record to see it listed here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "30px",
        margin: "20px 0"
      }}>
        <h2 style={{ 
          color: "#333", 
          margin: "0 0 20px 0",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          📋 My Medical Records ({records.length})
        </h2>
        
        <div style={{ display: "grid", gap: "15px" }}>
          {records.map((record) => (
            <div key={record.id} style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "20px",
              background: "#fafafa",
              transition: "box-shadow 0.2s ease"
            }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr auto", 
                gap: "20px",
                alignItems: "center"
              }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                    📄 {record.fileName}
                  </h4>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
                    <strong>Record ID:</strong> {record.id}
                  </p>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
                    <strong>CID:</strong> {record.pieceCid.slice(0, 20)}...
                  </p>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
                    <strong>Uploaded:</strong> {new Date(record.uploadDate).toLocaleDateString()}
                  </p>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                    <strong>Size:</strong> {(record.fileSize / 1024).toFixed(1)} KB • 
                    <span style={{ 
                      color: record.encrypted ? "#28a745" : "#6c757d",
                      marginLeft: "5px"
                    }}>
                      {record.encrypted ? "🔒 Encrypted" : "🔓 Not Encrypted"}
                    </span>
                  </p>
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    style={{
                      background: "#17a2b8",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    📄 View
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(record.pieceCid)}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    📋 Copy CID
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Viewer Modal */}
      {selectedRecord && (
        <RecordViewer
          pieceCid={selectedRecord.pieceCid}
          fileName={selectedRecord.fileName}
          encrypted={selectedRecord.encrypted}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
};
