import OpenAI from 'openai';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ChatCompletionMessageParam } from 'openai/resources';

import systemMessage from '../../../data/systemMessage.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { topic, tokens } = req.query;

    const messages = [
      {
        role: 'system',
        content: systemMessage
      }
    ];

    if (topic && topic.length > 0) {
      messages.push({
        role: 'user',
        content: topic as string
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as ChatCompletionMessageParam[],
      temperature: 1,
      max_tokens: tokens ? parseInt(tokens as string) : 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    res.status(200).json({ prompt: response.choices[0]?.message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
