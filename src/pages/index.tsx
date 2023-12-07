import * as React from 'react';

import Head from "next/head";
import { getTypingTest, getWordScore } from '~/utils/typingTest';
import Spinner from '~/components/Spinner';
import Timer from '~/components/Timer';

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

  const restartTest = React.useCallback(() => {
    if(!loading) {
      setLoading(true);
      setTestRunning(false);
      getTypingTest({
        topic,
      }).then(res => {
        setScore(0);
        setTypedWords([]);
        setCurrentWord(res.split(' ')[0]);
        setWordsToType(res.split(' ').slice(1));
        setInputValue('');
        setLoading(false);
        setTestRunning(true);
        setStartTime(Date.now());
        inputRef?.current?.focus();
      }).catch(err => {
        setTestRunning(false);
        console.error(err);
      });
    }
  }, [loading, inputRef, topic]);

  const onType = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if(
      (value.endsWith(' ') && value.trim() === currentWord) || 
      (value.trim() === currentWord && wordsToType.length === 0)) {
      if(wordsToType.length === 0) {
        setTestRunning(false);
        setEndTime(Date.now());
      }
      setTypedWords([...typedWords, inputValue]);
      setScore(score + getWordScore(currentWord) + (value.endsWith(' ') ? 1 : 0));
      setCurrentWord(wordsToType[0]);
      setWordsToType(wordsToType.slice(1));
      setInputValue('');
    } else {
      setInputValue(e.target.value);
    }
  }, [typedWords, wordsToType, inputValue, score, currentWord]);

  const renderContent = React.useCallback(() => {
    if(loading) {
      return (
        <div className="bg-zinc-800 rounded w-full p-3 text-xl">
          <Spinner />
        </div>
      );
    } 
    if (testRunning) {
      return (
        <div className="select-none bg-zinc-800 rounded w-full p-3 text-xl">
          <span className="text-green-500">{typedWords.map(word => word + ' ')}</span>
          <CurrentWord word={currentWord} inputValue={inputValue} />{' '}
          <span className="">{wordsToType.map(word => word + ' ')}</span>
        </div>
      );
    } 

    return (
      <div className="flex gap-1 w-full">
        <input type="text" className='bg-zinc-800 focus:outline-none p-2 rounded grow text-center italic' maxLength={30} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." />
      </div>
    );
  }, [loading, testRunning, typedWords, currentWord, inputValue, wordsToType, topic]);

  const renderBottom = React.useCallback(() => {
    if(testRunning || loading) {
      return (
        <div className='flex gap-1 w-full'>
          <input className='bg-zinc-800 focus:outline-none p-2 rounded grow' onChange={onType} value={inputValue} ref={inputRef} />
          <button onClick={restartTest} className='bg-zinc-800 rounded p-2'>Restart</button>
        </div>
      );
    }
    return (
      <button onClick={restartTest} className='bg-zinc-800 rounded p-2 w-full'>Start</button>
    );
  }, [testRunning, loading, inputValue, onType, restartTest]);

  const getWPM = React.useCallback(() => {
    if(!startTime) return;

    let currentEndTime = Date.now();

    if(!testRunning && endTime) {
      currentEndTime = endTime;
    }

    const minutes = (currentEndTime - startTime) / 1000 / 60;
    return Math.floor(score / 5 / minutes);
  }, [score, startTime, endTime, testRunning]);

  return (
    <>
      <Head>
        <title>GPT Typing Game</title>
        <meta name="description" content="A typing game that uses the GPT Api in order to generate topical texts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100">
        <div className='flex flex-col w-1/2 gap-1'>
          <div className='grid gap-1 w-full grid-cols-2'>
            <div className='bg-zinc-800 rounded p-2 text-center'>Time: <Timer startTime={startTime} endTime={endTime} running={testRunning} /></div>
            <div className='bg-zinc-800 rounded p-2 text-center'>WPM: {getWPM()}</div>
          </div>
          {renderContent()}
          {renderBottom()}
        </div>
      </main>
    </>
  );
}
