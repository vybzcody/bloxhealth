// hooks/useAccessControl.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSynapse } from "@/providers/SynapseProvider";
import { BrowserProvider } from "ethers";
import { createMedicalRecordStorageContract, createMedicalRecordStorageContractWithSigner } from "@/utils/contractCompat";

export const useAccessControl = () => {
  const { synapse } = useSynapse();
  const queryClient = useQueryClient();
  
  // Get contract address from environment variables
  const contractAddress = process.env.NEXT_PUBLIC_MEDICAL_RECORD_STORAGE_ADDRESS || "";

  // Get access requests for a record
  const getAccessRequests = async (recordId: number) => {
    if (!synapse || !contractAddress) throw new Error("Synapse not initialized or contract address not set");
    
    const provider = new BrowserProvider(synapse.getProvider() as any);
    const contract = createMedicalRecordStorageContract(contractAddress, provider);
    
    return contract.getAccessRequests(recordId);
  };

  // Request access to a medical record
  const requestAccess = useMutation({
    mutationFn: async ({ 
      recordId, 
      providerAddress, 
      duration,
      reason 
    }: { 
      recordId: number; 
      providerAddress: string; 
      duration: number;
      reason: string;
    }) => {
      if (!synapse || !contractAddress) throw new Error("Synapse not initialized or contract address not set");
      
      const signer = synapse.getSigner();
      const contract = createMedicalRecordStorageContractWithSigner(contractAddress, signer);
      
      const tx = await contract.requestTimedAccess(recordId, providerAddress, duration, reason);
      await tx.wait();
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    }
  });

  // Approve an access request
  const approveAccess = useMutation({
    mutationFn: async ({ recordId, requestId }: { recordId: number; requestId: number }) => {
      if (!synapse || !contractAddress) throw new Error("Synapse not initialized or contract address not set");
      
      const signer = synapse.getSigner();
      const contract = createMedicalRecordStorageContractWithSigner(contractAddress, signer);
      
      const tx = await contract.approveAccess(recordId, requestId);
      await tx.wait();
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    }
  });

  // Revoke an access request
  const revokeAccess = useMutation({
    mutationFn: async ({ recordId, requestId }: { recordId: number; requestId: number }) => {
      if (!synapse || !contractAddress) throw new Error("Synapse not initialized or contract address not set");
      
      const signer = synapse.getSigner();
      const contract = createMedicalRecordStorageContractWithSigner(contractAddress, signer);
      
      const tx = await contract.revokeAccess(recordId, requestId);
      await tx.wait();
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    }
  });

  // Use emergency access code
  const useEmergencyCode = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      if (!synapse || !contractAddress) throw new Error("Synapse not initialized or contract address not set");
      
      const signer = synapse.getSigner();
      const contract = createMedicalRecordStorageContractWithSigner(contractAddress, signer);
      
      // Simple emergency code simulation for demo
      const tx = await contract.useEmergencyCode(code);
      await tx.wait();
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    }
  });

  return {
    getAccessRequests,
    requestAccess,
    approveAccess,
    revokeAccess,
    useEmergencyCode,
  };
};