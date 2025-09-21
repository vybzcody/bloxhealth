"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRole } from "@/providers/RoleProvider";
import { RoleSelection } from "@/components/RoleSelection";
import { ProviderDashboard } from "@/components/ProviderDashboard";
import { PatientTabs } from "@/components/PatientTabs";

export default function Home() {
  const { role, isPatient, isProvider, setRole } = useRole();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Show role selection if no role chosen
  if (!role) {
    return <RoleSelection />;
  }

  // Show provider dashboard
  if (isProvider) {
    return <ProviderDashboard />;
  }

  // Patient flow - show tabbed dashboard
  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif", 
      maxWidth: "1200px", 
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f8f9fa"
    }}>
      <PatientTabs />
    </div>
  );
}
