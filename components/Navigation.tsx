import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRole } from "@/providers/RoleProvider";

export const Navigation = () => {
  const { isConnected } = useAccount();
  const { role, setRole, isPatient, isProvider } = useRole();

  // Don't show navigation if not connected or no role selected
  if (!isConnected || !role) {
    return null;
  }

  return (
    <nav style={{ 
      padding: "15px 20px", 
      background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        {/* Logo and Role Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ 
            textDecoration: "none", 
            color: "white", 
            fontWeight: "bold", 
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🏥 MediVault
          </div>
          
          <div style={{
            background: isPatient ? "rgba(59, 130, 246, 0.2)" : "rgba(245, 158, 11, 0.2)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: `1px solid ${isPatient ? "rgba(59, 130, 246, 0.3)" : "rgba(245, 158, 11, 0.3)"}`
          }}>
            {isPatient ? "👤 Patient" : "👩‍⚕️ Provider"}
          </div>
        </div>

        {/* Role-based Navigation */}
        <div style={{ display: "flex", gap: "10px" }}>
          {isPatient && (
            <>
              <div style={{ 
                color: "white",
                padding: "10px 20px",
                borderRadius: "25px",
                background: "rgba(255,255,255,0.2)",
                fontWeight: "500"
              }}>
                📁 Upload Records
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.8)",
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: "normal"
              }}>
                📋 My Records
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.8)",
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: "normal"
              }}>
                💳 Subscription
              </div>
            </>
          )}
          
          {isProvider && (
            <>
              <div style={{ 
                color: "white",
                padding: "10px 20px",
                borderRadius: "25px",
                background: "rgba(255,255,255,0.2)",
                fontWeight: "500"
              }}>
                📋 Access Requests
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.8)",
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: "normal"
              }}>
                🚨 Emergency Access
              </div>
            </>
          )}
        </div>

        {/* User Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setRole(null)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem"
            }}
          >
            Switch Role
          </button>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
