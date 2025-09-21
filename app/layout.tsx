import './globals.css';
import type { Metadata } from 'next';
import { RootLayoutClient } from './RootLayoutClient';

export const metadata: Metadata = {
  title: 'MediVault - Decentralized Medical Records',
  description: 'Store your medical records securely on Filecoin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}