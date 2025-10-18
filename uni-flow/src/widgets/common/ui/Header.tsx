import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

import { LOGO } from '@/shared/consts/images';
import { HeaderTitle } from '@/features/common';

interface HeaderProps {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  return (
    <header className={clsx(props.className, "flex flex-row w-full max-h-[60px] items-center px-[16px]")}>
      <div className="flex items-center mr-[8px]">
        <Link href="/academic">
          <Image 
            className="dark:filter dark:invert"
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
      </div>
    </header>
  );
};
