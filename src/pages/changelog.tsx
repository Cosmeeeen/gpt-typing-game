import moment from 'moment';
import * as React from 'react';
import Spinner from '~/components/Spinner';
import { api } from '~/utils/api';

const AboutPage = () => {
  const { isLoading, data: commits } = api.github.commits.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center bg-zinc-900 text-zinc-100 gap-1">
      <div className="flex flex-col w-full md:w-3/4 gap-2">
        {isLoading ? (
          <Spinner />
        ) :
          commits?.map((commit, index) => (
            <div key={index} className={`flex w-full justify-between items-center bg-zinc-800 border-2 border-zinc-700 rounded p-3 gap-2`}>
              <p>{moment(Date.parse(commit.date)).fromNow()}</p>
              <p className="grow">{commit.message}</p>
            </div>
          ))
        }
      </div>
    </main>
  );
};

export default AboutPage;