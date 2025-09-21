"use client";

import { Synapse, WarmStorageService } from "@filoz/synapse-sdk";
import { createContext, useState, useEffect, useContext } from "react";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { config } from "@/config";

export const SynapseContext = createContext<{
  synapse: Synapse | null;
  warmStorageService: WarmStorageService | null;
  isLoading: boolean;
  error: string | null;
}>({ 
  synapse: null, 
  warmStorageService: null,
  isLoading: false,
  error: null
});

export const SynapseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [synapse, setSynapse] = useState<Synapse | null>(null);
  const [warmStorageService, setWarmStorageService] = useState<WarmStorageService | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const signer = useEthersSigner();

  const createSynapse = async () => {
    if (!signer) {
      setSynapse(null);
      setWarmStorageService(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Initializing Synapse with signer...");
      
      // Initialize Synapse SDK with the real signer
      const synapseInstance = await Synapse.create({
        signer,
        withCDN: config.withCDN,
        disableNonceManager: false,
      });

      console.log("Synapse initialized successfully");

      // Create WarmStorageService instance
      const warmStorageServiceInstance = await WarmStorageService.create(
        synapseInstance.getProvider(),
        synapseInstance.getWarmStorageAddress()
      );

      console.log("WarmStorageService initialized successfully");

      setSynapse(synapseInstance);
      setWarmStorageService(warmStorageServiceInstance);
    } catch (err) {
      console.error("Failed to initialize Synapse:", err);
      setError(`Failed to initialize Filecoin services: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setSynapse(null);
      setWarmStorageService(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createSynapse();
  }, [signer]);

  return (
    <SynapseContext.Provider value={{ synapse, warmStorageService, isLoading, error }}>
      {children}
    </SynapseContext.Provider>
  );
};

export const useSynapse = () => {
  const context = useContext(SynapseContext);
  if (context === undefined) {
    throw new Error("useSynapse must be used within a SynapseProvider");
  }
  return context;
};