"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';

export const HeaderTitle = () => {
  const pathname = usePathname() || '/';
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const trails = useMemo(
    () =>
      segments.map((seg, i) => ({
        label:
          seg
            .replace(/-/g, ' ')
            .replace(/^([a-zA-Z])/, (m) => m.toUpperCase())
            .replace(/^(.)(.*)$/, (_, a, b) => a + (b ?? '').toLowerCase()),
        href: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
      })),
    [segments]
  );

  return (
    <div className="ml-6 mb-2">
      {segments.length === 0 ? (
        <h1 className={clsx('text-center text-title2-semibold text-primary')}>
          UniFlow
        </h1>
      ) : (
        <nav className="flex items-center gap-2 text-title2-semibold text-primary">
          {trails.map((t, idx) => (
            <Fragment key={t.href}>
              {t.isLast ? (
                <span className="truncate">{t.label}</span>
              ) : (
                <Link href={t.href} className="truncate hover:underline">
                  {t.label}
                </Link>
              )}
              {idx < trails.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[--muted]" strokeWidth={2} />
              )}
            </Fragment>
          ))}
        </nav>
      )}
    </div>
  );
};
