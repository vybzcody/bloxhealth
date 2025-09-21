"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "patient" | "provider" | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isProvider: boolean;
  isPatient: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);

  return (
    <RoleContext.Provider 
      value={{
        role,
        setRole,
        isProvider: role === "provider",
        isPatient: role === "patient"
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};
