"use client";

import { WagmiProvider } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { SynapseProvider } from "@/providers/SynapseProvider";
import { RoleProvider } from "@/providers/RoleProvider";
import { Navigation } from "@/components/Navigation";

// You'll need to get a project ID from WalletConnect
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID_HERE";

const { connectors } = getDefaultWallets({
  appName: 'MediVault',
  projectId: WALLETCONNECT_PROJECT_ID,
});

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors,
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

const queryClient = new QueryClient();

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <SynapseProvider>
            <RoleProvider>
              <Navigation />
              <main>
                {children}
              </main>
            </RoleProvider>
          </SynapseProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}