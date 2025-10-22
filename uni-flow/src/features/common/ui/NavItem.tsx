"use client";

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { NavbarItem } from '@/shared/common/router';


interface Props {
  className?: string;
  item: NavbarItem;
  index: number;
}

export const NavItem = (props: Props) => {
  const { item, index } = props;
  const pathname = usePathname() || '/';

  const isActive = pathname === item.href;

  return (
    <div 
      key={index} 
      className={clsx(
        "flex items-center justify-center w-full py-3",
        isActive ? "bg-white" : "bg-primary",
      )}
    >
      <Link 
        href={item.href} 
        className="flex flex-col gap-1 items-center w-full"
      >
        <div className="relative w-7 h-7">
          <Image 
            src={item.icon.src} 
            alt={item.icon.alt} 
            width={24} 
            height={24} 
            className={clsx(
              "w-full h-full transition-all",
              isActive
                ? "filter-none"
                : "filter brightness-0 invert"
            )}
          />
        </div>
        <p className={clsx(
          "text-center text-body2-bold text-[14px]",
          isActive ? "text-[color: var(--primary-light)]" : "text-white"
        )}>
          {item.label}
        </p>
      </Link>
    </div>
  );
};
