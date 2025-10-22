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

      {hideNav ? (
        <main className="pt-[70px] min-h-[calc(115vh-70px)] flex flex-col">
          {children}
        </main>
      ) : (
        <div className="pt-[70px] flex flex-col min-h-[calc(115vh-70px)]">
          <div className="flex flex-row flex-1">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}