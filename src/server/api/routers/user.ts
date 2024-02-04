import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  topWpm: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      select: { id: true, name: true, image: true, bestWpm: true },
      orderBy: { bestWpm: 'desc' },
      take: 10,
    });
  }),
  topScore: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      select: { id: true, name: true, image: true, totalScore: true },
      orderBy: { totalScore: 'desc' },
      take: 5,
    });
  }),
});
