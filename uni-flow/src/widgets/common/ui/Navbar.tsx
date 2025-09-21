import clsx from 'clsx';

import { NavbarGroup, router } from '@/shared/common';
import { NavItem } from '@/features/common';

interface Props {
  className?: string;
}

export const Navbar = (props: Props) => {
  
  return (
    <aside className={clsx(props.className, "bg-primary-light flex items-start justify-center min-w-[90px] h-auto")}>
      <nav className="flex flex-col items-center w-full">
        {router.filter((item) => item.group >= NavbarGroup.PROD).map((item, index) => {
          return (
            <NavItem key={index} item={item} index={index} />
          );
        })}
      </nav>
    </aside>
  );
};
