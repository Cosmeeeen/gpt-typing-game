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
  getUserWPM: publicProcedure.input(z.object({
    userId: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    const { userId } = input;
    if (!userId) {
      return null;
    }
    const lastResults = await ctx.db.testResult.findMany({
      where: {
        userId,
      },
      orderBy: { finishedAt: 'desc' },
      take: 10,
    });
    if (!lastResults || lastResults.length === 0) {
      return null;
    }
    switch (lastResults.length) {
      case 0: 
        return 0;
      case 1:
        if (!lastResults[0]) return null;
        return lastResults[0].wpm;
      case 2:
        if (!lastResults[0] || !lastResults[1]) return null;
        return Math.round((lastResults[0].wpm + lastResults[1].wpm) / 2);
      default:
        const modifiedResults = lastResults.sort((a, b) => a.wpm - b.wpm);
        modifiedResults.shift();
        modifiedResults.pop();
        return Math.round(modifiedResults.reduce((acc, curr) => acc + curr.wpm, 0) / lastResults.length);
    }
  }),
  create: publicProcedure.input(z.object({
    wpm: z.number(),
    score: z.number(),
    time: z.number(),
    prompt: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const { wpm, prompt, score, time } = input;

    const userId = ctx.session?.user.id;
    if (userId) {
    }
  

    try { 
      const createdResult = await ctx.db.testResult.create({
        data: {
          wpm,
          score,
          time,
          prompt,
          finishedAt: new Date(),
          userId,
        },
      });

      if (userId) {
        const userDetails = await ctx.db.user.findUnique({
          where: { id: userId},
          select: { bestWpm: true, totalScore: true }
        });
        const { bestWpm: currentBestWpm, totalScore: currentTotalScore } = userDetails ?? { bestWpm: 0, totalScore: '0' };
        
        const bestWpm = Math.max(currentBestWpm, wpm);  
        const totalScore = (parseInt(currentTotalScore, 10) + score).toString();

        await ctx.db.user.update({
          where: {
            id: userId,
          },
          data: {
            testsTaken: {
              increment: 1,
            },
            bestWpm,
            totalScore,
          }
        });
      }

      return createdResult;
    } catch (e) {
      console.error(e);
      return null;
    }
  })
});
