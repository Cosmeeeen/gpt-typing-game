import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import LogLib from '@loglib/tracker/react';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";

import HamburgerMenu from '../components/HamburgerMenu';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>GPT Typing Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LogLib config={{
        id: 'gpt-typing-game'
      }} />
      <HamburgerMenu />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
