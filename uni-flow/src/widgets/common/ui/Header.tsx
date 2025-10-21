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

interface HeaderProps {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  const { userId } = useAuthStore();

  const isLoggedIn = !!userId;
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
    <header className={clsx(props.className, "flex flex-row w-full max-h-[60px] items-center px-[16px]")}>
      <div className="flex items-center mr-[8px]">
        <Link href="/academic">
          <Image 
            className="mb-2"
            src={LOGO.src}
            alt={LOGO.alt}
            width={68}
            height={68}
            priority
          />
        </Link>
      </div>
      <div className="flex items-center justify-between ml-[8px] w-full h-[60px] border-b border-b-[#E5E7EB]">
        <HeaderTitle />
        <div className="flex items-center gap-3 mr-4">
          {isLoggedIn ? (
            <>
              <span>
                Welcome, &nbsp;
                  <span className="font-medium text-[--text]">{name}</span> 
              </span>
              <Button size="sm" variant="bordered" className="rounded-full px-5 mx-2" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-sm underline underline-offset-4 hover:text-[--primary]"
              >
                Sign up
              </Link>
              <Link href="/login">
                <Button size="sm" className="rounded-full px-5">Log in</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
