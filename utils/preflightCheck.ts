import { Synapse } from "@filoz/synapse-sdk";
import { WarmStorageService } from "@filoz/synapse-sdk/warm-storage";
import { ethers } from "ethers";

const config = {
  withCDN: true,
  persistencePeriod: 365, // days
  minDaysThreshold: 30,
};

/**
 * Check allowances and balances for storage operations
 */
const checkAllowances = async (
  warmStorageBalance: any,
  minDaysThreshold: number,
  includeDataSetCreationFee: boolean
) => {
  // Simplified allowance check - in production this would be more complex
  const rateAllowanceNeeded = ethers.parseUnits("100", 6); // 100 USDFC
  const lockupAllowanceNeeded = ethers.parseUnits("50", 6); // 50 USDFC
  const depositAmountNeeded = ethers.parseUnits("200", 6); // 200 USDFC

  return {
    isSufficient: false, // Always require deposit for demo
    rateAllowanceNeeded,
    lockupAllowanceNeeded,
    depositAmountNeeded,
  };
};

/**
 * Performs a preflight check before file upload to ensure sufficient USDFC balance and allowances
 */
export const preflightCheck = async (
  file: File,
  synapse: Synapse,
  includeDataSetCreationFee: boolean,
  updateStatus: (status: string) => void,
  updateProgress: (progress: number) => void
) => {
  try {
    // Initialize Warm Storage service for allowance checks
    const warmStorageService = await WarmStorageService.create(
      synapse.getProvider(),
      synapse.getWarmStorageAddress()
    );

    // Check if current allowance is sufficient for the file size
    const warmStorageBalance = await warmStorageService.checkAllowanceForStorage(
      file.size,
      config.withCDN,
      synapse.payments,
      config.persistencePeriod
    );

    // Check if allowances and balances are sufficient
    const {
      isSufficient,
      rateAllowanceNeeded,
      lockupAllowanceNeeded,
      depositAmountNeeded,
    } = await checkAllowances(
      warmStorageBalance,
      config.minDaysThreshold,
      includeDataSetCreationFee
    );

    // If allowance is insufficient, handle deposit and approval process
    if (!isSufficient) {
      updateStatus("💰 Insufficient USDFC allowance...");
      updateProgress(12);

      // Deposit USDFC to cover storage costs
      updateStatus("💰 Depositing USDFC to cover storage costs...");
      const depositTx = await synapse.payments.deposit(
        depositAmountNeeded,
        "USDFC",
        {
          onDepositStarting: () => updateStatus("💰 Depositing USDFC..."),
          onAllowanceCheck: (current: bigint, required: bigint) =>
            updateStatus(
              `💰 Allowance check ${
                current > required ? "sufficient" : "insufficient"
              }`
            ),
          onApprovalTransaction: async (tx: ethers.TransactionResponse) => {
            updateStatus(`💰 Approving USDFC... ${tx.hash.slice(0, 10)}...`);
            const receipt = await tx.wait();
            updateStatus(`💰 USDFC approved ${receipt?.hash.slice(0, 10)}...`);
          },
        }
      );
      await depositTx.wait();
      updateStatus("💰 USDFC deposited successfully");
      updateProgress(18);

      // Approve Filecoin Warm Storage service to spend USDFC
      updateStatus("💰 Approving Filecoin Warm Storage service...");
      const approvalTx = await synapse.payments.approveService(
        synapse.getWarmStorageAddress(),
        rateAllowanceNeeded,
        lockupAllowanceNeeded,
        BigInt(config.persistencePeriod * 24 * 60 * 60) // Convert days to seconds
      );
      await approvalTx.wait();
      updateStatus("💰 Filecoin Warm Storage service approved");
      updateProgress(22);
    }
  } catch (error) {
    console.error("Preflight check failed:", error);
    throw new Error(`Preflight check failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
