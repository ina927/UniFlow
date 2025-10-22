'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { Header, Navbar, Footer } from '@/widgets/common';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isLanding = pathname === '/';
  return (
     <>
      <Header />

      {!isLanding && (
        <div className="flex flex-row">
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
        </div>
      )}

      {isLanding && <main>{children}</main>}

      <Footer />
    </>
  );
}