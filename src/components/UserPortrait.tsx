import Image from 'next/image';
import * as React from 'react';

import defaultPortrait from '../data/defaultPortrait.png';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Spinner from './Spinner';

interface UserPortraitProps {
  className?: string;
};

const UserPortrait: React.FC<UserPortraitProps> = ({ className }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return (
    <div className={className + ' flex justify-row justify-center items-center gap-3'}>
      <Spinner />
    </div>
  );

  return (
    <div className={className + ' flex justify-row justify-center items-center gap-3'}>
      <p>{session?.user?.name ?? 'Log in to save your results'}</p>
      <Image
        src={session?.user?.image ?? defaultPortrait}
        alt="User picture"
        className="w-14 h-14 bg-zinc-800 border-2 rounded-full cursor-pointer"
        width={500}
        height={500}
        onClick={() => session ? void router.push('/profile') : void signIn()} />
    </div>
  );
};

export default UserPortrait;
