# Client Contracts

This directory contains the generated TypeScript type definitions for the smart contracts.

## Generated Files

- `MedicalRecordStorage.ts` - Type definitions for the MedicalRecordStorage contract
- `SimpleStorage.ts` - Type definitions for the SimpleStorage contract (test contract)
- `index.ts` - Main export file
- `factories/` - Contract factory classes for deployment

## How to Update

To regenerate the type definitions after contract changes:

1. In the `contracts` directory, run:
   ```bash
   npx hardhat compile
   ```

2. The typechain files will be automatically generated in this directory.

## Usage

Import contract types in your frontend code:

```typescript
import { MedicalRecordStorage__factory } from "@/contracts/typechain";
```