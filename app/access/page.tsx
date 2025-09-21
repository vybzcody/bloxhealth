// app/access/page.tsx
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccessControl } from "@/hooks/useAccessControl";

export default function AccessManagement() {
  const { isConnected } = useAccount();
  const { getAccessRequests, requestAccess, approveAccess, revokeAccess } = useAccessControl();
  const [recordId, setRecordId] = useState<number>(0);
  const [providerAddress, setProviderAddress] = useState<string>("");
  const [duration, setDuration] = useState<number>(3600);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetRequests = async () => {
    if (recordId <= 0) return;
    
    setLoading(true);
    try {
      const result = await getAccessRequests(recordId);
      setRequests(result);
    } catch (error) {
      console.error("Failed to get access requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!providerAddress || recordId <= 0) return;
    
    try {
      await requestAccess.mutateAsync({ 
        recordId, 
        providerAddress, 
        duration, 
        reason: "Medical consultation access request" 
      });
      alert("Access request submitted successfully!");
      handleGetRequests();
    } catch (error) {
      console.error("Failed to request access:", error);
      alert("Failed to request access");
    }
  };

  if (!isConnected) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "60px 40px",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            margin: "0 0 20px 0", 
            color: "#333"
          }}>
            🔐 Access Management
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            color: "#666", 
            margin: "0 0 30px 0"
          }}>
            Connect your wallet to manage medical record access
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif", 
      maxWidth: "1000px", 
      margin: "0 auto",
      minHeight: "100vh"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "#333", margin: 0 }}>Access Management</h1>
        <ConnectButton />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "30px",
        marginBottom: "30px"
      }}>
        {/* Request Access Card */}
        <div style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            color: "#333", 
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📝 Request Access
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Record ID:
            </label>
            <input 
              type="number" 
              value={recordId}
              onChange={(e) => setRecordId(Number(e.target.value))}
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              placeholder="Enter record ID"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Provider Address:
            </label>
            <input 
              type="text" 
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              placeholder="0x..."
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Duration (seconds):
            </label>
            <select 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            >
              <option value={3600}>1 Hour</option>
              <option value={86400}>1 Day</option>
              <option value={604800}>1 Week</option>
              <option value={2592000}>1 Month</option>
            </select>
          </div>

          <button 
            onClick={handleRequestAccess}
            disabled={!providerAddress || recordId <= 0 || requestAccess.isPending}
            style={{ 
              width: "100%",
              padding: "12px", 
              background: providerAddress && recordId > 0 && !requestAccess.isPending ? 
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: providerAddress && recordId > 0 && !requestAccess.isPending ? "pointer" : "not-allowed",
              fontWeight: "bold"
            }}
          >
            {requestAccess.isPending ? "Requesting..." : "Request Access"}
          </button>
        </div>

        {/* View Requests Card */}
        <div style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            color: "#333", 
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            👀 View Requests
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Record ID:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="number" 
                value={recordId}
                onChange={(e) => setRecordId(Number(e.target.value))}
                style={{ 
                  flex: 1,
                  padding: "12px", 
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem"
                }}
                placeholder="Enter record ID"
              />
              <button 
                onClick={handleGetRequests}
                disabled={recordId <= 0 || loading}
                style={{ 
                  padding: "12px 20px", 
                  background: recordId > 0 && !loading ? "#28a745" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: recordId > 0 && !loading ? "pointer" : "not-allowed",
                  fontWeight: "bold"
                }}
              >
                {loading ? "Loading..." : "Get Requests"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            color: "#333", 
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📋 Access Requests for Record #{recordId}
          </h2>
          
          <div style={{ display: "grid", gap: "15px" }}>
            {requests.map((request, index) => (
              <div key={index} style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "20px",
                background: "#fafafa"
              }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr auto", 
                  gap: "20px",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>
                      <strong>Requester:</strong> {request.requester}
                    </p>
                    <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>
                      <strong>Status:</strong> 
                      <span style={{ 
                        color: request.approved ? "#28a745" : "#ffc107",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {request.approved ? "Approved" : "Pending"}
                      </span>
                    </p>
                    <p style={{ margin: "0", fontSize: "0.9rem" }}>
                      <strong>Duration:</strong> {request.duration} seconds
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    {!request.approved && (
                      <button 
                        onClick={() => approveAccess.mutateAsync({ recordId, requestId: index })}
                        disabled={approveAccess.isPending}
                        style={{ 
                          padding: "8px 16px", 
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Approve
                      </button>
                    )}
                    
                    <button 
                      onClick={() => revokeAccess.mutateAsync({ recordId, requestId: index })}
                      disabled={revokeAccess.isPending}
                      style={{ 
                        padding: "8px 16px", 
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
