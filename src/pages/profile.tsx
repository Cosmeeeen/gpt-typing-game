import * as React from 'react';
import { signOut, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

import Spinner from '~/components/Spinner';
import defaultPortrait from '../data/defaultPortrait.png';
import { useRouter } from 'next/router';
import ResultsTable from '~/components/ResultsTable';
import Link from 'next/link';
import { api } from '~/utils/api';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: userTestCount } = api.testResults.getUserTotal.useQuery({ userId: session?.user.id });

  const renderProfile = React.useCallback(() => {
    if (status === 'loading') {
      return <Spinner />;
    }

    if (status === 'unauthenticated' || !session) {
      void router.push('/');

      return (
        <>
          <div>Unauthenticated</div>
          <a onClick={() => void signIn()} className="underline cursor-pointer">Log in</a>
        </>
      );
    }

    return (
      <div className='w-full flex gap-2'>
        <Image
          src={session.user.image ?? defaultPortrait}
          width={200}
          height={200}
          alt="User's profile picture"
          className="rounded-full bg-zinc-800 border-4 "
        />
        <div className='flex-fill grow bg-zinc-800 rounded flex flex-col justify-around items-left gap-2 p-5'>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Tests taken: {userTestCount}</p>
          <a onClick={() => void signOut()} className="underline cursor-pointer">Log out</a>
        </div>
      </div>
    );
  }, [status, session, router, userTestCount]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100 gap-2 w-full">
        <div className="w-1/2">
          <Link href="/" className='fixed top-5 left-5 text-5xl px-3 py-3 hover:text-zinc-300'>{'<'}</Link>
          {renderProfile()}
          <ResultsTable />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
