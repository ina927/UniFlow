'use client';

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

import { LOGO } from '@/shared/consts/images';
import { HeaderTitle } from '@/features/common';
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from '@/shared/stores';
import { useLogout } from '@/shared/hooks/useLogout';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  const { userId } = useAuthStore();
  const pathname = usePathname();

  const isLoggedIn = !!userId;
  const isRegisterPage = pathname?.startsWith('/register');
  const [name, setName] = useState<string>("");

  const getUserDetails = async() => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (res.status === 401) {
          return;
        }
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || '');
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    }

    useEffect(() => {
      if (userId) {
        getUserDetails();
      }
    }, [userId]);

    const { logout } = useLogout();
  return (
    <header
      className={clsx(
        props.className,
        "fixed top-0 left-0 w-full z-50 bg-background border-b border-b-[#E5E7EB] shadow-sm h-[70px]"
      )}
    >
      <div className="flex flex-row items-center justify-between px-[16px]">
        <div className="flex items-center mr-[8px] h-full mt-2">
          <Link href="/academic" aria-label="Go to Academic">
            <Image
              src={LOGO.src}
              alt={LOGO.alt}
              width={90}
              height={60}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center justify-between w-full mt-3">
          <HeaderTitle />
          <div className="flex items-center gap-3 mr-4">
            {isLoggedIn ? (
              <>
                <span>
                  Welcome,&nbsp;
                  <span className="font-medium text-[--text]">{name}</span>
                </span>
                <Button
                  size="sm"
                  variant="bordered"
                  className="rounded-full px-5 mx-2"
                  onClick={logout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                {isRegisterPage ? (
                  <Link href="/">
                    <Button size="sm" className="rounded-full px-5">
                      Log in
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="sm" className="rounded-full px-5">
                      Register
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
