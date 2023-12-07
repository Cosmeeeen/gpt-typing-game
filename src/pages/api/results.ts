import { type TestResult } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '~/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed ( yet ;) )' });
    return;
  }

  try {
    const results = await prisma.testResult.findMany({
      orderBy: { finishedAt: 'desc' },
    });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
