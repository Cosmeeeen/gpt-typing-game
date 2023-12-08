import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const testResultsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.testResult.findMany({
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
  }),
  create: publicProcedure.input(z.object({
    wpm: z.number(),
    prompt: z.string(),
  })).mutation(({ ctx, input }) => {
    const { wpm, prompt } = input;

    return ctx.db.testResult.create({
      data: {
        wpm,
        prompt,
        finishedAt: new Date(),
      },
    });
  })
});
