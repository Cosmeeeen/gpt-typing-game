import * as React from "react";
import moment from 'moment';

import type { TestResult } from "@prisma/client";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const ResultsTable: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [results, setResults] = React.useState<TestResult[]>([]);
  const { data: session, status } = useSession();
  const { data } = api.testResults.getByUser.useQuery({ userId: session?.user.id });

  React.useEffect(() => {
    if (!data) {
      return;
    }
    setResults(data);
    setLoading(false);
  }, [data]);

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

  if (status === 'loading' || status === 'unauthenticated') return;

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col w-full gap-1'>
          {renderResults()}
        </div>
      )}
    </>
  );
}

export default ResultsTable;
