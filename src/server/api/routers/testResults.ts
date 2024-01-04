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
    take: z.number().optional().default(10),
    page: z.number().optional().default(1),
  })).query(async ({ ctx, input }) => {
    const { userId, take, page } = input;
    if (!userId) {
      return null;
    }
    const itemsTotal = await ctx.db.testResult.count({
      where: {
        userId,
      }
    });
    const pagesTotal = Math.ceil(itemsTotal / take);
    const items = await ctx.db.testResult.findMany({
      where: {
        userId,
      },
      orderBy: { finishedAt: 'desc' },
      skip: page * take - take,
      take,
    });
    return { items, pagesTotal };
  }),
  getUserTotal: publicProcedure.input(z.object({
    userId: z.string().optional(),
  })).query(({ ctx, input }) => {
    const { userId } = input;
    if (!userId) {
      return null;
    }
    return ctx.db.testResult.count({
      where: {
        userId,
      },
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
