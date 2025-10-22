import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { NavbarGroup, router } from '@/shared/common';
import { NavItem } from '@/features/common';

interface Props {
  className?: string;
}

export const Navbar = (props: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setIsAdmin(String(data?.user?.role).toUpperCase() === 'ADMIN');
      } catch {/* no-op */}
    })();
    return () => { active = false; };
  }, []);

  const items = isAdmin
    ? router
        .filter((it) => it.href === '/admin' || it.href === '/profile')
        .map((it) => (it.href === '/admin' ? { ...it, label: 'Users' } : it))
    : router.filter((item) => item.group >= NavbarGroup.PROD);

  return (
    <aside className={clsx(props.className, "bg-primary-light flex items-start justify-center min-w-[90px] min-h-[calc(100vh-108px)] h-auto")}>
      <nav className="flex flex-col items-center w-full">
        {items.map((item, index) => {
          return (
            <NavItem key={index} item={item} index={index} />
          );
        })}
      </nav>
    </aside>
  );
};
