import { Contract, BrowserProvider } from "ethers";
import MedicalRecordStorageABI from "@/contracts/MedicalRecordStorage.abi.json";

/**
 * Creates a MedicalRecordStorage contract instance compatible with ethers v6
 */
export function createMedicalRecordStorageContract(
  address: string, 
  provider: BrowserProvider
): Contract {
  return new Contract(address, MedicalRecordStorageABI, provider);
}

/**
 * Creates a MedicalRecordStorage contract instance with signer
 */
export function createMedicalRecordStorageContractWithSigner(
  address: string,
  signer: any
): Contract {
  return new Contract(address, MedicalRecordStorageABI, signer);
}
