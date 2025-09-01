"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const HeaderTitle = () => {
  const pathname = usePathname() || '/';
  
  const displayText = pathname === "/" ? "UniFlow" : pathname.slice(1).toUpperCase();
  
  return (
    <Link href={pathname}>
      <h1 className={clsx("text-center text-title3-bold")}>
        {displayText}
      </h1>
    </Link>
  );
};
