import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import { QueryProviders } from '@/shared/providers';
import AppShell from './AppShell';

export const metadata: Metadata = {
  title: "UniFlow",
  description: "University Course Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <QueryProviders>
          <AppShell>{children}</AppShell>
        </QueryProviders>
      </body>
    </html>
  );
}