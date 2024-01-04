import * as React from "react";
import moment from 'moment';

import type { TestResult } from "@prisma/client";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const ResultsTable: React.FC = () => {
  const [results, setResults] = React.useState<TestResult[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const { data: session, status: sessionStatus } = useSession();
  const { data, status } = api.testResults.getByUser.useQuery({ userId: session?.user.id, page, take: 10 });

  React.useEffect(() => {
    if (!data) {
      return;
    }
    setResults(data.items);
  }, [data]);

  React.useEffect(() => {
    if (data && page > data?.pagesTotal) {
      setPage(data.pagesTotal);
    }
  }, [page, data]);

  const renderResults = React.useCallback(() => {
    if (results.length === 0 || sessionStatus === 'unauthenticated' || status === 'error') {
      return null;
    }
    if (sessionStatus === 'loading' || status === 'loading') {
      return <Spinner />;
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
  }, [results, sessionStatus, status]);

  const nextPage = React.useCallback(() => {
    if (!data) return;
    if (page + 1 > data?.pagesTotal) return;
    setPage(page + 1);
  }, [page, data]);

  const previousPage = React.useCallback(() => {
    if (!data) return;
    if (page - 1 < 1) return;
    setPage(page - 1);
  }, [page, data]);

  const renderPagination = React.useCallback(() => {
    if (results.length === 0 || !session) {
      return null;
    }
    return (
      <div className="flex flex-row gap-1">
        <button className="w-10 h-10 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors" onClick={previousPage}>{'<'}</button>
        <p className="rounded bg-zinc-800 grow text-center flex items-center justify-center">Page {page} of {data?.pagesTotal}</p>
        <button className="w-10 h-10 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors" onClick={nextPage}>{'>'}</button>
      </div>
    );
  }, [session, results, data, page, nextPage, previousPage]);

  if (sessionStatus === 'unauthenticated') return;

  return (
    <div className='flex flex-col w-full gap-1'>
      {renderResults()}
      {renderPagination()}
    </div>
  );
}

export default ResultsTable;
