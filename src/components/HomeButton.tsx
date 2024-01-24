import Link from 'next/link';
import * as React from 'react';

const HomeButton = () => {
  return (
    <Link
      href="/"
      className='fixed top-5 left-5 text-5xl px-3 py-3 hover:text-zinc-300'
    >
      {'<'}
    </Link>
  );
};

export default HomeButton;
