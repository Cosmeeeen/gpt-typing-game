import * as React from 'react';
import { ArrowRight, Menu, X } from 'react-feather';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const pages = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Profile',
    href: '/profile',
  },
  {
    name: 'Top Scores',
    href: '/top/score',
  },
  {
    name: 'Top WPM',
    href: '/top/wpm',
  },
  {
    name: 'Changelog',
    href: '/changelog',
  },
  {
    name: 'About',
    href: '/about',
  },
];

const Spinner: React.FC = () => {
  const pathname = usePathname();

  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const switchMenu = React.useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div>
      {open ? <div className='fixed w-full h-full bg-black bg-opacity-50 z-10'></div> : <Menu className='cursor-pointer fixed top-5 left-5 text-zinc-100 hover:text-zinc-300' size={32} onClick={switchMenu} />}
      <div className={`fixed flex flex-col text-2xl gap-5 bg-zinc-800 w-fit h-full overflow-hidden pr-5 transition-transform z-20 ${open ? '' : '-translate-x-full'}`}>
        <X className='cursor-pointer text-zinc-100 hover:text-zinc-300 ml-5 mt-5' size={32} onClick={switchMenu} />
        {
          pages.map(page => (
            <>
              <Link href={page.href} key={page.name} className='text-zinc-100 hover:text-zinc-300 flex flex-row items-center'>
                <ArrowRight />
                {page.name}
              </Link>
            </>
          ))
        }
      </div>
    </div>
  );
}

export default Spinner;
