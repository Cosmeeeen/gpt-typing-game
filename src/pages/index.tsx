import * as React from 'react';

import Head from "next/head";
import { getTypingTest, getWordScore } from '~/utils/typingTest';
import Spinner from '~/components/Spinner';
import Timer from '~/components/Timer';
import Link from 'next/link';
import { api } from '~/utils/api';
import UserPortrait from '~/components/UserPortrait';
import { useSession } from 'next-auth/react';
import { Info } from 'react-feather';

const CurrentWord: React.FC<{ word: string | undefined, inputValue: string }> = ({ word, inputValue }) => {
  return (
    <span>
      {word?.split('').map((letter, i) => {
        const isTyped = i < inputValue.length;
        const isCorrect = letter === inputValue[i];
        const color = isTyped ? (isCorrect ? 'text-green-500' : 'text-red-500') : '';
        return (
          <span key={i} className={`${color} underline`}>{letter}</span>
        );
      })}
      {inputValue.length >= (word ? word?.length : 0) && (
        <span className='text-red-500'>{inputValue.slice(word?.length)}</span>
      )}
    </span>
  );
};

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [testRunning, setTestRunning] = React.useState<boolean>(false);

  const [wordsToType, setWordsToType] = React.useState<string[]>([]);
  const [currentWord, setCurrentWord] = React.useState<string>();
  const [typedWords, setTypedWords] = React.useState<string[]>([]);

  const [inputValue, setInputValue] = React.useState<string>('');

  const [score, setScore] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<number>();
  const [endTime, setEndTime] = React.useState<number>();

  const [topic, setTopic] = React.useState<string>('');

  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: mutateResult } = api.testResults.create.useMutation();

  const restartTest = React.useCallback(() => {
    if (!loading) {
      setLoading(true);
      setStartTime(undefined);
      setEndTime(undefined);
      setScore(0);
      setTestRunning(false);
      getTypingTest({
        topic,
      }).then(res => {
        setTypedWords([]);
        setCurrentWord(res.split(' ')[0]);
        setWordsToType(res.split(' ').slice(1));
        setInputValue('');
        setLoading(false);
        setTestRunning(true);
        inputRef?.current?.focus();
      }).catch(err => {
        setTestRunning(false);
        console.error(err);
      });
    }
  }, [loading, inputRef, topic]);

  const getWPM = React.useCallback((currentScore: number) => {
    if (!startTime) return;

    let currentEndTime = Date.now();

    if (!testRunning && endTime) {
      currentEndTime = endTime;
    }

    const minutes = (currentEndTime - startTime) / 1000 / 60;
    return Math.floor(currentScore / 5 / minutes);
  }, [startTime, endTime, testRunning]);

  const getTime = React.useCallback(() => {
    if (!startTime) return;

    let currentEndTime = Date.now();

    if (!testRunning && endTime) {
      currentEndTime = endTime;
    }

    return Math.floor((currentEndTime - startTime) / 1000);
  }, [startTime, endTime, testRunning]);

  const submitResult = React.useCallback((finalScore: number) => {
    setTestRunning(false);
    setEndTime(Date.now());
    const resultsObject = {
      wpm: getWPM(finalScore) ?? 0,
      time: getTime() ?? 0,
      score: Math.floor(finalScore / 5),
      prompt: topic,
    };
    mutateResult(resultsObject);
    setStartTime(undefined);
    setEndTime(undefined);
    setScore(0);
  }, [topic, getWPM, mutateResult, getTime]);

  const onType = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (testRunning && !startTime) {
      setStartTime(Date.now());
    }
    if (
      (value.endsWith(' ') && value.trim() === currentWord) ||
      (value.trim() === currentWord && wordsToType.length === 0)) {
      setTypedWords([...typedWords, inputValue]);
      const currentScore = score + getWordScore(currentWord) + (value.endsWith(' ') ? 1 : 0);
      setScore(currentScore);
      setCurrentWord(wordsToType[0]);
      setWordsToType(wordsToType.slice(1));
      setInputValue('');
      if (wordsToType.length === 0) {
        submitResult(currentScore);
      }
    } else {
      setInputValue(e.target.value);
    }
  }, [typedWords, wordsToType, inputValue, score, currentWord, submitResult, startTime, testRunning]);

  const renderContent = React.useCallback(() => {
    if (loading) {
      return (
        <div className="bg-zinc-800 rounded w-full p-3 text-xl">
          <Spinner />
        </div>
      );
    }
    if (testRunning) {
      return (
        <div className="select-none bg-zinc-800 rounded w-full p-3 text-xl overflow-hidden">
          <span className="text-green-500">{typedWords.map(word => word + ' ')}</span>
          <CurrentWord word={currentWord} inputValue={inputValue} />{' '}
          <span className="">{wordsToType.map(word => word + ' ')}</span>
        </div>
      );
    }

    return (
      <div className="flex gap-1 w-full bg-zinc-800 rounded">
        <input type="text" className='focus:outline-none p-2 bg-transparent grow text-center italic' maxLength={50} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." />
        <p className="relative right-3 top-3 text-xs h-fit text-zinc-500">{topic.length}/50</p>
      </div >
    );
  }, [loading, testRunning, typedWords, currentWord, inputValue, wordsToType, topic]);

  const renderBottom = React.useCallback(() => {
    if (testRunning || loading) {
      return (
        <div className='flex gap-1 w-full'>
          <input className='bg-zinc-800 focus:outline-none p-2 rounded grow' onChange={onType} value={inputValue} ref={inputRef} />
          <button onClick={restartTest} className='bg-zinc-800 rounded p-2'>Restart</button>
        </div>
      );
    }
    return (
      <div className='flex gap-1 w-full'>
        <button onClick={restartTest} className='bg-zinc-800 rounded p-2 grow'>Start</button>
      </div>
    );
  }, [testRunning, loading, inputValue, onType, restartTest]);

  return (
    <>
      <Head>
        <meta name="description" content="A typing game that uses the GPT Api in order to generate topical texts." />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100">
        <UserPortrait className="fixed top-5 right-5" />
        <div className='flex flex-col w-1/2 gap-1'>
          <div className='grid gap-1 w-full grid-cols-2'>
            <div className='bg-zinc-800 rounded p-2 text-center'>Time: <Timer startTime={startTime} endTime={endTime} running={testRunning} /></div>
            <div className='bg-zinc-800 rounded p-2 text-center'>WPM: {getWPM(score)}</div>
          </div>
          {renderContent()}
          {renderBottom()}
          <Link href='/about' className='fixed bottom-5 left-5 hover:text-zinc-300'>
            <Info size={32} />
          </Link>
        </div>
      </main>
    </>
  );
}
