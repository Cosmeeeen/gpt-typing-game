import * as React from "react";
import Head from "next/head";
import axios from "axios";
import moment from 'moment';

import type { TestResult } from "@prisma/client";

const ResultsPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = React.useState<TestResult[]>([]);

  React.useEffect(() => {
    axios.get<TestResult[]>('/api/results').then(res => {
      const { data } = res;
      setResults(data);
    }).catch(err => {
      console.error(err);
    })
  }, []);

  const renderHeader = React.useCallback(() => {
    let headerText = '';
    if(results.length === 0) {
      headerText = 'No results yet';
    } else {
      headerText = `Results (${results.length}):`;
    }
    return (
      <h1 className='text-center text-2xl'>{headerText}</h1>
    );
  }, [results.length]);

  const renderResults = React.useCallback(() => {
    if(results.length === 0) {
      return null;
    }
    return (
      <ul className="flex flex-col gap-1">
        {results.map(result => (
          <li key={result.id} className='text-center bg-zinc-800 rounded'>
            {moment(result.finishedAt).fromNow()} - {result.prompt} - {result.wpm}
          </li>
        ))}
      </ul>
    );
  }, [results]);

  return (
    <>
      <Head>
        <title>Results - GPT Typing Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100">
        <div className='flex flex-col w-1/2 gap-1'>
          {renderHeader()}
          {renderResults()}
        </div>
      </main>
    </>
  );
}

export default ResultsPage;
