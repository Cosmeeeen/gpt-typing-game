import * as React from "react";
import Head from "next/head";
import moment from 'moment';

import type { TestResult } from "@prisma/client";
import Spinner from "~/components/Spinner";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const ResultsPage: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [results, setResults] = React.useState<TestResult[]>([]);
  // const { data } = api.testResults.getAll.useQuery();
  const { data: session } = useSession();
  const { data } = api.testResults.getByUser.useQuery({ userId: session?.user.id });

  React.useEffect(() => {
    if (!data) {
      return;
    }
    setResults(data);
    setLoading(false);
  }, [data]);

  const renderHeader = React.useCallback(() => {
    let headerText = '';
    if (results.length === 0) {
      headerText = 'No results yet';
    } else if (!session) {
      headerText = 'Sign in to save your results';
    } else {
      headerText = `Results (${results.length})`;
    }
    return (
      <div className='flex w-full gap-1'>
        <Link href='/' className='bg-zinc-800 rounded text-xl py-2 px-5 hover:bg-zinc-700 transition-colors'>Back</Link>
        <h1 className='bg-zinc-800 rounded text-center text-xl p-2 grow'>{headerText}</h1>
      </div>
    );
  }, [results.length, session]);

  const renderResults = React.useCallback(() => {
    if (results.length === 0 || !session) {
      return null;
    }
    return (
      <table className='border-separate border-spacing-y-1'>
        <tr className='bg-zinc-800'>
          <th className='p-2 rounded-l'>Prompt</th>
          <th className='p-2 border-x-2 border-zinc-700'>Finished At</th>
          <th className='p-2 rounded-r'>WPM</th>
        </tr>
        {results.map(result => (
          <tr key={result.id} className="text-center bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <td className='p-2 rounded-l'>{result.prompt}</td>
            <td className='p-2 border-x-2 border-zinc-700'>{moment(result.finishedAt).fromNow()}</td>
            <td className='p-2 rounded-r'>{result.wpm}</td>
          </tr>
        ))}
      </table>
    );
  }, [results, session]);

  return (
    <>
      <Head>
        <title>Results - GPT Typing Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100">
        {loading ? (
          <Spinner />
        ) : (
          <div className='flex flex-col w-1/2 gap-1'>
            {renderHeader()}
            {renderResults()}
          </div>
        )}
      </main >
    </>
  );
}

export default ResultsPage;
