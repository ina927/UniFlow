'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { Header, Navbar, Footer } from '@/widgets/common';
import { hi } from 'date-fns/locale';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const hideNav = pathname === '/' || pathname.startsWith('/register');

  return (
     <>
      <Header />

      {!hideNav && (
        <div className="flex flex-row">
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
        </div>
      )}

      {hideNav && <main>{children}</main>}

      <Footer />
    </>
  );
}