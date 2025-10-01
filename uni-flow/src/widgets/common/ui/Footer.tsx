import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { LOGO } from '@/shared/consts/images';

interface Props {
  className?: string;
}

export const Footer = (props: Props) => {
  return (
    <footer className={clsx(props.className, "bg-[#F9FAFB] flex items-center justify-between w-full h-[48px] px-[16px] py-[32px]")}>
      <div className="flex items-center justify-start">
        <Link href="/">
          <Image src={LOGO.src} alt={LOGO.alt} width={56} height={56} />
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-body1-bold">&copy; {new Date().getFullYear()} UniFlow</p>
      </div>
    </footer>
  );
};
