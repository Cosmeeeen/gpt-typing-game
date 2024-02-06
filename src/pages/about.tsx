import * as React from 'react';
import Link from 'next/link';
import { loglib } from '@loglib/tracker';

const AboutPage = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLElement>) => {
    loglib.track('click', { href: e.currentTarget.getAttribute('href'), text: e.currentTarget.textContent });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center bg-zinc-900 text-zinc-100 gap-1">
      <h1 className="text-3xl">GPT Typing Game</h1>
      <p>A game by <a onClick={handleLinkClick} href='https://www.cosmin.zip/' className='underline' target='_blank'>Cosmin Ilie</a></p>
      <p>Powered by <a onClick={handleLinkClick} href='https://openai.com/' className='underline' target='_blank'>OpenAI</a>&apos;s GPT-3.5-turbo model</p>
      <p>Source code available on <a onClick={handleLinkClick} href='https://github.com/Cosmeeeen/gpt-typing-game' className='underline' target='_blank'>GitHub</a></p>
      <p>Currently in early development, expect changes in the future. You can check out the changelog <Link onClick={handleLinkClick} href="/changelog" className='underline'>here</Link>.</p>
      <p>If you have any questions or suggestions related to this project, feel free to contact me at <a onClick={handleLinkClick} href='mailto: gpt-typing-game@cosmin.zip' target="_blank" className="underline">gpt-typing-game@cosmin.zip</a></p>
      <p>If you want to support the project, you can do so by <a onClick={handleLinkClick} href='https://www.buymeacoffee.com/cosmeen' className='underline' target='_blank'>buying me a coffee</a>.</p>
    </main>
  );
};

export default AboutPage;