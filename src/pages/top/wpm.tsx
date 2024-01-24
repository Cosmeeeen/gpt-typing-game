import Image from 'next/image';
import * as React from 'react';
import { api } from '~/utils/api';

import defaultPortrait from '~/data/defaultPortrait.png';
import { useSession } from 'next-auth/react';
import HomeButton from '~/components/HomeButton';

const TopWpmPage = () => {
  const { data: topUsers } = api.user.topWpm.useQuery();
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100">
      <HomeButton />
      Users With The Highest All-Time WPM
      <div className="flex flex-col w-full md:w-1/2 gap-2">
        {topUsers?.map((user, index) => (
          <div key={user.id} className={`flex w-full justify-between items-center bg-zinc-800 border-2 border-zinc-700 ${session?.user.id === user.id ? 'border-solid' : 'border-none'} rounded p-3 gap-2`}>
            <p>{index + 1}.</p>
            <Image
              src={user.image ?? defaultPortrait}
              width={35}
              height={35}
              alt={`${user.name}'s profile picture`}
              className='rounded-full'
            />
            <p className="grow">{user.name}</p>
            <p>{user.bestWpm}</p>
          </div>
        )
        )}
      </div>
    </main>
  );
};

export default TopWpmPage;
