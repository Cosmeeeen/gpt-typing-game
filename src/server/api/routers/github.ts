import axios from 'axios';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import type { AxiosResponse } from 'axios';

interface Commit {
  commit: {
    message: string;
    author: {
      date: string;
    }
  }
}

export const githubRouter = createTRPCRouter({
  commits: publicProcedure.query(async () => {
    const { data }: AxiosResponse<Commit[]> = await axios.get('https://api.github.com/repos/cosmeeeen/gpt-typing-game/commits?per_page=10');
    const formatedCommits = data.map((commit: Commit) => ({
      message: commit.commit.message,
      date: commit.commit.author.date
    }));

    return formatedCommits;
  }),
});
