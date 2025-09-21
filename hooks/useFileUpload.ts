import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSynapse } from "@/providers/SynapseProvider";
import { preflightCheck } from "@/utils/preflightCheck";
import { MedicalRecordEncryption } from "@/utils/encryption";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { createMedicalRecordStorageContractWithSigner } from "@/utils/contractCompat";
import { useAccount } from "wagmi";

export type UploadedInfo = {
  fileName?: string;
  fileSize?: number;
  pieceCid?: string;
  txHash?: string;
  recordId?: number;
  encrypted?: boolean;
};

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedInfo, setUploadedInfo] = useState<UploadedInfo | null>(null);
  const { synapse } = useSynapse();
  const signer = useEthersSigner();
  const queryClient = useQueryClient();
  const { address } = useAccount();

  const mutation = useMutation({
    mutationKey: ["file-upload", address],
    mutationFn: async ({ file, password }: { file: File; password?: string }) => {
      if (!synapse) throw new Error("Synapse not initialized");
      if (!address) throw new Error("Address not found");
      
      const contractAddress = process.env.NEXT_PUBLIC_MEDICAL_RECORD_STORAGE_ADDRESS;
      if (!contractAddress) throw new Error("Contract address not configured");
      if (!signer) throw new Error("Signer not available");

      setProgress(0);
      setUploadedInfo(null);
      setStatus("🔄 Initializing file upload to Filecoin...");

      // 1) Handle encryption if password provided
      let fileData: Uint8Array;
      const isEncrypted = !!password;
      if (password) {
        setStatus("🔐 Encrypting medical record...");
        setProgress(5);
        const encryptedData = await MedicalRecordEncryption.encryptRecord(await file.arrayBuffer(), password);
        fileData = new Uint8Array(encryptedData.encryptedData);
      } else {
        const arrayBuffer = await file.arrayBuffer();
        fileData = new Uint8Array(arrayBuffer);
      }

      // 2) Get datasets and check if we need dataset creation fee
      const datasets = await synapse.storage.findDataSets(address);
      const includeDatasetCreationFee = datasets.length === 0;

      // 3) Preflight check for USDFC balance and allowances
      setStatus("💰 Checking USDFC balance and storage allowances...");
      setProgress(10);
      await preflightCheck(file, synapse, includeDatasetCreationFee, setStatus, setProgress);

      setStatus("🔗 Setting up storage service and dataset...");
      setProgress(25);

      // 4) Create storage service with callbacks
      const storageService = await synapse.createStorage({
        callbacks: {
          onDataSetResolved: (info) => {
            console.log("Dataset resolved:", info);
            setStatus("🔗 Existing dataset found and resolved");
            setProgress(30);
          },
          onDataSetCreationStarted: (transactionResponse, statusUrl) => {
            console.log("Dataset creation started:", transactionResponse);
            setStatus("🏗️ Creating new dataset on blockchain...");
            setProgress(35);
          },
          onDataSetCreationProgress: (status) => {
            console.log("Dataset creation progress:", status);
            if (status.transactionSuccess) {
              setStatus("⛓️ Dataset transaction confirmed on chain");
              setProgress(45);
            }
            if (status.serverConfirmed) {
              setStatus(`🎉 Dataset ready! (${Math.round(status.elapsedMs / 1000)}s)`);
              setProgress(50);
            }
          },
          onProviderSelected: (provider) => {
            console.log("Storage provider selected:", provider);
            setStatus("🏪 Storage provider selected");
            setProgress(55);
          },
        },
      });

      setStatus("📁 Uploading encrypted medical record...");
      setProgress(60);

      // 5) Upload file with progress callbacks
      const { pieceCid } = await storageService.upload(fileData, {
        onUploadComplete: (piece) => {
          setStatus("📊 File uploaded! Adding to dataset...");
          setUploadedInfo((prev) => ({
            ...prev,
            fileName: file.name,
            fileSize: file.size,
            pieceCid: piece.toV1().toString(),
            encrypted: isEncrypted,
          }));
          setProgress(80);
        },
        onPieceAdded: (transactionResponse) => {
          setStatus(
            `🔄 Confirming transaction on blockchain${
              transactionResponse ? ` (${transactionResponse.hash.slice(0, 10)}...)` : ""
            }`
          );
          if (transactionResponse) {
            console.log("Transaction response:", transactionResponse);
            setUploadedInfo((prev) => ({
              ...prev,
              txHash: transactionResponse.hash,
            }));
            
            // Add timeout for stuck transactions
            setTimeout(() => {
              if (progress < 90) {
                setStatus("⏳ Transaction taking longer than expected, but file is uploaded...");
                setProgress(88);
              }
            }, 30000); // 30 second timeout
          }
          setProgress(85);
        },
        onPieceConfirmed: (pieceIds) => {
          setStatus("🌳 Medical record added to dataset successfully");
          setProgress(90);
        },
      });

      // 6) Store record metadata in smart contract - REQUIRED
      setStatus("📝 Storing record metadata on blockchain...");
      setProgress(95);

      const contract = createMedicalRecordStorageContractWithSigner(contractAddress, signer);
      const tx = await contract.uploadRecord(
        pieceCid.toV1().toString(),
        file.name,
        file.size,
        isEncrypted
      );
      
      const receipt = await tx.wait();
      // Extract recordId from event logs
      const uploadEvent = receipt.events?.find((e: any) => e.event === 'RecordUploaded');
      const recordId = uploadEvent?.args?.recordId;
      
      setUploadedInfo((prev) => ({
        ...prev,
        recordId: recordId ? recordId.toNumber() : undefined,
      }));
      
      setStatus("✅ Record metadata stored on blockchain!");

      setUploadedInfo((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        pieceCid: pieceCid.toV1().toString(),
        encrypted: isEncrypted,
      }));

      return { pieceCid: pieceCid.toV1().toString() };
    },
    onSuccess: (data) => {
      setStatus("🎉 Medical record successfully stored on Filecoin!");
      setProgress(100);
      
      // Invalidate and refetch user records from blockchain
      queryClient.invalidateQueries({ queryKey: ["userRecords", address] });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setStatus(`❌ Upload failed: ${error instanceof Error ? error.message : "Please try again"}`);
      setProgress(0);
    },
  });

  const handleReset = () => {
    setProgress(0);
    setStatus("");
    setUploadedInfo(null);
  };

  return {
    uploadFileMutation: mutation,
    progress,
    status,
    uploadedInfo,
    handleReset,
  };
};
