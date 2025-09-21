import { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useSynapse } from "@/providers/SynapseProvider";
import { UserRecordsList } from "./UserRecordsList";
import { SubscriptionPlans } from "./SubscriptionPlans";
import { RecordViewer } from "./RecordViewer";
import { UploadProgress } from "./UploadProgress";

export const PatientTabs = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const { synapse, isLoading: synapseLoading } = useSynapse();
  const { uploadFileMutation, uploadedInfo, handleReset, progress, status } = useFileUpload();
  const { isPending: isUploading, mutateAsync: uploadFile } = uploadFileMutation;

  const tabs = [
    { id: "upload", label: "📁 Upload Records", icon: "📁" },
    { id: "records", label: "📋 My Records", icon: "📋" },
    { id: "subscription", label: "💳 Subscription", icon: "💳" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      await uploadFile({ file, password: password || undefined });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleResetClick = () => {
    handleReset();
    setFile(null);
    setPassword("");
  };

  return (
    <>
      {/* Tab Navigation */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "0",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          borderBottom: "1px solid #eee"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "20px",
                border: "none",
                background: activeTab === tab.id ? "#6b7280" : "transparent",
                color: activeTab === tab.id ? "white" : "#666",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderBottom: activeTab === tab.id ? "3px solid #4b5563" : "3px solid transparent"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "30px" }}>
          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div>
              <h2 style={{ color: "#333", margin: "0 0 20px 0" }}>📁 Upload Medical Record</h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#555",
                  fontWeight: "bold"
                }}>
                  Select Medical Record:
                </label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  style={{ 
                    width: "100%",
                    padding: "12px", 
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#555",
                  fontWeight: "bold"
                }}>
                  🔐 Encryption Password (Optional):
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to encrypt your record"
                    style={{ 
                      flex: 1,
                      padding: "12px", 
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem"
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

              <button 
                onClick={handleUpload}
                disabled={!file || isUploading || !synapse || synapseLoading}
                style={{ 
                  width: "100%",
                  padding: "15px", 
                  background: file && !isUploading && synapse && !synapseLoading ? 
                    "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  cursor: file && !isUploading && synapse && !synapseLoading ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  margin: "20px 0"
                }}
              >
                {isUploading ? "Uploading..." : 
                 synapseLoading ? "Initializing..." :
                 !synapse ? "Filecoin Service Unavailable" :
                 "Upload to Filecoin"}
              </button>

              {/* Enhanced Progress Display */}
              <UploadProgress 
                progress={progress}
                status={status}
                isUploading={isUploading}
              />

              {uploadedInfo && (
                <div style={{
                  background: "#d1ecf1",
                  border: "1px solid #bee5eb",
                  borderRadius: "12px",
                  padding: "20px",
                  margin: "20px 0"
                }}>
                  <h3 style={{ color: "#0c5460", margin: "0 0 10px 0" }}>✅ Upload Successful!</h3>
                  <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#0c5460" }}>
                    <strong>File ID:</strong> {uploadedInfo.pieceCid}
                  </p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button
                      onClick={handleResetClick}
                      style={{
                        background: "#17a2b8",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Upload Another File
                    </button>
                    <button
                      onClick={() => setShowViewer(true)}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      📄 View Record
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Records Tab */}
          {activeTab === "records" && <UserRecordsList />}

          {/* Subscription Tab */}
          {activeTab === "subscription" && <SubscriptionPlans />}
        </div>
      </div>

      {/* Record Viewer Modal */}
      {showViewer && uploadedInfo && (
        <RecordViewer
          pieceCid={uploadedInfo.pieceCid!}
          fileName={uploadedInfo.fileName!}
          encrypted={uploadedInfo.encrypted || false}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};
