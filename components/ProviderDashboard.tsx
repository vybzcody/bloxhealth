import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRole } from "@/providers/RoleProvider";
import { useAccessControl } from "@/hooks/useAccessControl";

export const ProviderDashboard = () => {
  const { isConnected, address } = useAccount();
  const { setRole } = useRole();
  const { requestAccess, useEmergencyCode } = useAccessControl();
  const [patientAddress, setPatientAddress] = useState("");
  const [recordId, setRecordId] = useState("");
  const [accessReason, setAccessReason] = useState("");
  const [emergencyCode, setEmergencyCode] = useState("");

  const handleRequestAccess = async () => {
    if (!patientAddress || !recordId || !accessReason || !address) return;
    
    try {
      await requestAccess.mutateAsync({
        recordId: parseInt(recordId),
        providerAddress: address,
        duration: 3600, // 1 hour
        reason: accessReason
      });
      
      alert("✅ Access request submitted successfully!");
      // Reset form
      setPatientAddress("");
      setRecordId("");
      setAccessReason("");
    } catch (error) {
      console.error("Failed to request access:", error);
      alert(`❌ Failed to request access: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEmergencyAccess = async () => {
    if (!emergencyCode) return;
    
    try {
      await useEmergencyCode.mutateAsync({ code: emergencyCode });
      alert("✅ Emergency access granted!");
      setEmergencyCode("");
    } catch (error) {
      console.error("Emergency access failed:", error);
      alert(`❌ Emergency access failed: ${error instanceof Error ? error.message : 'Invalid code'}`);
    }
  };

  if (!isConnected) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
            👩‍⚕️ Provider Portal
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            color: "#666", 
            margin: "0 0 30px 0"
          }}>
            Connect your wallet to access patient records
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
      maxWidth: "1200px", 
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f8f9fa"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px",
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div>
          <h1 style={{ color: "#333", margin: "0 0 5px 0" }}>👩‍⚕️ Healthcare Provider Dashboard</h1>
          <p style={{ color: "#666", margin: 0 }}>Request and manage patient record access</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setRole(null)}
            style={{
              background: "#6c757d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Switch Role
          </button>
          <ConnectButton />
        </div>
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
            📋 Request Patient Access
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Patient Wallet Address:
            </label>
            <input 
              type="text" 
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
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
              Record ID:
            </label>
            <input 
              type="text" 
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
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
              Access Reason:
            </label>
            <textarea 
              value={accessReason}
              onChange={(e) => setAccessReason(e.target.value)}
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                minHeight: "80px",
                resize: "vertical"
              }}
              placeholder="e.g., Routine checkup, Emergency treatment, Consultation..."
            />
          </div>

          <button 
            onClick={handleRequestAccess}
            disabled={!patientAddress || !recordId || !accessReason || requestAccess.isPending}
            style={{ 
              width: "100%",
              padding: "12px", 
              background: patientAddress && recordId && accessReason && !requestAccess.isPending ? 
                "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: patientAddress && recordId && accessReason && !requestAccess.isPending ? "pointer" : "not-allowed",
              fontWeight: "bold"
            }}
          >
            {requestAccess.isPending ? "Submitting..." : "📤 Submit Access Request"}
          </button>
        </div>

        {/* Emergency Access Card */}
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
            🚨 Emergency Access
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
              fontWeight: "bold"
            }}>
              Emergency Access Code:
            </label>
            <input 
              type="text" 
              value={emergencyCode}
              onChange={(e) => setEmergencyCode(e.target.value)}
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              placeholder="Enter emergency code from patient"
            />
          </div>

          <button 
            onClick={handleEmergencyAccess}
            disabled={!emergencyCode || useEmergencyCode.isPending}
            style={{ 
              width: "100%",
              padding: "12px", 
              background: emergencyCode && !useEmergencyCode.isPending ? "#dc3545" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: emergencyCode && !useEmergencyCode.isPending ? "pointer" : "not-allowed",
              fontWeight: "bold"
            }}
          >
            {useEmergencyCode.isPending ? "Processing..." : "🚨 Use Emergency Code"}
          </button>

          <div style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "15px",
            marginTop: "15px"
          }}>
            <p style={{ color: "#856404", margin: 0, fontSize: "0.9rem" }}>
              <strong>⚠️ Emergency Access:</strong> Only use in critical medical situations. 
              All emergency access is logged and audited.
            </p>
          </div>
        </div>
      </div>

      {/* My Access Requests */}
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
          📊 My Access Requests
        </h2>
        
        <div style={{
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📋</div>
          <p style={{ color: "#666", margin: 0 }}>
            No access requests yet. Submit a request above to see it here.
          </p>
        </div>
      </div>
    </div>
  );
};
