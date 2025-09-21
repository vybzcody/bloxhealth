import { useQuery } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import { createMedicalRecordStorageContract } from "@/utils/contractCompat";
import { BrowserProvider } from "ethers";

interface UserRecord {
  id: number;
  fileName: string;
  pieceCid: string;
  uploadDate: string;
  encrypted: boolean;
  fileSize: number;
  owner: string;
}

export const useUserRecords = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const contractAddress = process.env.NEXT_PUBLIC_MEDICAL_RECORD_STORAGE_ADDRESS;

  return useQuery({
    queryKey: ["userRecords", address],
    queryFn: async (): Promise<UserRecord[]> => {
      if (!walletClient || !contractAddress || !address) {
        return [];
      }

      try {
        // Create BrowserProvider from walletClient
        const provider = new BrowserProvider(walletClient.transport);
        const contract = createMedicalRecordStorageContract(contractAddress, provider);
        
        // Get total record count
        const recordCount = await contract.recordCount();
        const records: UserRecord[] = [];

        // Fetch all records and filter by owner
        for (let i = 0; i < Number(recordCount); i++) {
          try {
            const record = await contract.records(i);
            
            if (record.owner.toLowerCase() === address.toLowerCase()) {
              // Parse metadata
              let metadata = { fileName: `Record ${i}`, fileSize: 0 };
              try {
                metadata = JSON.parse(record.metadata);
              } catch (e) {
                console.warn("Failed to parse metadata for record", i);
              }

              records.push({
                id: i,
                fileName: metadata.fileName || `Medical Record ${i}`,
                pieceCid: record.pieceCid,
                uploadDate: new Date(Number(record.timestamp) * 1000).toISOString(),
                encrypted: record.encrypted,
                fileSize: metadata.fileSize || 0,
                owner: record.owner
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch record ${i}:`, error);
          }
        }

        return records.reverse(); // Show newest first
      } catch (error) {
        console.error("Failed to fetch user records:", error);
        return [];
      }
    },
    enabled: !!walletClient && !!contractAddress && !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
