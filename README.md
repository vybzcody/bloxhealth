# MediVault Client

Frontend application for MediVault - Decentralized Medical Records Management

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your WalletConnect project ID and contract addresses.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit http://localhost:3000 in your browser

## Features

- File upload interface with progress tracking
- Wallet integration with RainbowKit/Wagmi
- Medical record encryption
- Access control management
- Responsive web design

## Development

The client is built with Next.js 13+ using the App Router. It uses:
- React for UI components
- TypeScript for type safety
- TanStack Query for server state management
- RainbowKit/Wagmi for wallet integration
- Synapse SDK for Filecoin integration

## Environment Variables

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID for wallet integration
- `NEXT_PUBLIC_MEDICAL_RECORD_STORAGE_ADDRESS` - Deployed contract address for MedicalRecordStorage

## Smart Contract Integration

The frontend integrates with the MedicalRecordStorage smart contract deployed on Filecoin. Type definitions are automatically generated from the Solidity contracts using TypeChain.

---

# MediVault - Decentralized Medical Records Management

A complete implementation of a decentralized medical records management system built on Filecoin Onchain Cloud with role-based access control, FilecoinPay integration, and comprehensive medical workflows.

## 🏆 Features

### **Beyond Basic Storage - Full Filecoin Onchain Cloud Integration**
- **Enhanced Smart Contracts**: Timed access control, audit trails, emergency access
- **FilecoinPay Integration**: USDFC subscription plans for storage
- **Record Retrieval**: View and download encrypted medical records
- **Role-Based Access**: Separate Patient and Provider workflows
- **Audit Trail**: Complete blockchain-based access logging

## 🚀 Deployed Contract

**Filecoin Calibration Testnet:**
- **Contract Address**: `0x881C1711A56CCeB5d84BC9373203fCe8BA2d5C14`
- **Network**: Filecoin Calibration
- **Features**: Timed access, audit trails, emergency codes

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Contract already deployed: 0x881C1711A56CCeB5d84BC9373203fCe8BA2d5C14
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Choose Patient or Provider role
   - Connect wallet and test workflows

## 🎭 Role-Based Workflows

### **👤 Patient Flow**
1. **Upload Records**: Encrypted medical records to Filecoin
2. **Manage Access**: Approve/deny provider access requests
3. **View Records**: Browse and download your medical history
4. **Emergency Codes**: Generate one-time access codes
5. **Subscriptions**: Pay for storage with USDFC

### **👩‍⚕️ Provider Flow**
1. **Request Access**: Submit access requests with medical reason
2. **View Records**: Access approved patient records
3. **Emergency Access**: Use emergency codes in critical situations
4. **Audit Trail**: View complete access history

## 🔧 Technical Features

### **Smart Contract Capabilities**
- **Timed Access Control**: Providers get time-limited access
- **Audit Trail**: Every action logged on blockchain
- **Emergency Access**: One-time codes for critical situations
- **Access Management**: Approve, revoke, and track permissions

### **Filecoin Onchain Cloud Integration**
- **Synapse SDK**: File storage and retrieval
- **FilecoinPay**: USDFC subscription payments (simulated)
- **Warm Storage**: Fast access to medical records
- **CDN Integration**: Quick record retrieval (foundation)

### **Security & Privacy**
- **AES-GCM Encryption**: Client-side record encryption
- **Wallet-Based Auth**: Secure blockchain authentication
- **Access Control**: Smart contract permission management
- **Audit Logging**: Complete transparency and compliance


## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript, role-based routing
- **Smart Contracts**: Enhanced Solidity with access control
- **Storage**: Filecoin via Synapse SDK
- **Payments**: FilecoinPay integration (USDFC)
- **Authentication**: Wallet-based with RainbowKit

## 🚀 Deployment

**Smart Contract**: Already deployed to Filecoin Calibration
**Frontend**: Ready for Vercel/Netlify deployment


## 🎉 Key Differentiators

1. **Medical-Specific Workflows**: Real healthcare use cases
2. **Role-Based Access**: Patient and Provider perspectives
3. **Time-Based Permissions**: Healthcare-appropriate access control
4. **Emergency Access**: Critical situation handling
5. **Complete Audit Trail**: Compliance and transparency
6. **FilecoinPay Integration**: Subscription-based storage model
7. **Professional UI/UX**: Production-ready medical interface
