import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const testResultsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.testResult.findMany({
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
  }),
  getByUser: publicProcedure.input(z.object({
    userId: z.string().optional(),
  })).query(({ ctx, input }) => {
    const { userId } = input;
    if (!userId) {
      return null;
    }
    return ctx.db.testResult.findMany({
      where: {
        userId,
      },
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
  }),
  create: publicProcedure.input(z.object({
    wpm: z.number(),
    prompt: z.string(),
  })).mutation(({ ctx, input }) => {
    const { wpm, prompt } = input;
    const userId = ctx.session?.user.id;

    return ctx.db.testResult.create({
      data: {
        wpm,
        prompt,
        finishedAt: new Date(),
        userId,
      },
    });
  })
});
