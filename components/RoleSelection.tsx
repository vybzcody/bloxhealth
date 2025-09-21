import { useRole } from "@/providers/RoleProvider";

export const RoleSelection = () => {
  const { setRole } = useRole();

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
        maxWidth: "700px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          margin: "0 0 20px 0", 
          color: "#333",
          fontWeight: "bold"
        }}>
          🏥 MediVault
        </h1>
        
        <p style={{ 
          fontSize: "1.2rem", 
          color: "#666", 
          margin: "0 0 40px 0",
          lineHeight: "1.6"
        }}>
          Choose your role to access the appropriate interface
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px"
        }}>
          {/* Patient Card */}
          <div 
            onClick={() => setRole("patient")}
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              borderRadius: "16px",
              padding: "40px 30px",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 25px rgba(79, 172, 254, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(79, 172, 254, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(79, 172, 254, 0.3)";
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>👤</div>
            <h2 style={{ color: "white", margin: "0 0 15px 0", fontSize: "1.8rem" }}>
              Patient
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: "1rem" }}>
              Upload and manage your medical records securely
            </p>
            <div style={{ 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: "8px", 
              padding: "15px", 
              marginTop: "20px",
              textAlign: "left"
            }}>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ Upload encrypted medical records
              </p>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ Manage access permissions
              </p>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ View audit trail
              </p>
            </div>
          </div>

          {/* Provider Card */}
          <div 
            onClick={() => setRole("provider")}
            style={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              borderRadius: "16px",
              padding: "40px 30px",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 25px rgba(250, 112, 154, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(250, 112, 154, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(250, 112, 154, 0.3)";
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>👩‍⚕️</div>
            <h2 style={{ color: "white", margin: "0 0 15px 0", fontSize: "1.8rem" }}>
              Healthcare Provider
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: "1rem" }}>
              Request access to patient records for treatment
            </p>
            <div style={{ 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: "8px", 
              padding: "15px", 
              marginTop: "20px",
              textAlign: "left"
            }}>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ Request patient record access
              </p>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ View approved medical records
              </p>
              <p style={{ color: "white", margin: "5px 0", fontSize: "0.9rem" }}>
                ✓ Emergency access codes
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: "40px",
          padding: "20px",
          background: "#f8f9fa",
          borderRadius: "12px",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ color: "#666", margin: 0, fontSize: "0.9rem" }}>
            💡 <strong>Demo Mode:</strong> This role selection enables testing different user flows. 
            In production, roles would be determined by authentication and credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
