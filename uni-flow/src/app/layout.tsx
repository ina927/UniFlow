import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import { Header, Navbar, Footer } from "@/widgets/common";
import { QueryProviders } from '@/shared/providers';

export const metadata: Metadata = {
  title: "UniFlow",
  description: "University Course Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased py-[16px]">
        <QueryProviders>
          <Header />
          <div className="flex flex-row">
            <Navbar />
            <main className="flex flex-col">
              {children}
            </main>
          </div>
          <Footer />
        </QueryProviders>
      </body>
    </html>
  );
}