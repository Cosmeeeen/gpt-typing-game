import Link from 'next/link';
import * as React from 'react';
import { Home } from 'react-feather';

const HomeButton = () => {
  return (
    <Link
      href="/"
      className='fixed top-5 left-5 text-5xl hover:text-zinc-300'
    >
      <Home />
    </Link>
  );
};

export default HomeButton;
