import OpenAI from 'openai';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a short paragraph (maximum 70 words) based on the user-provided topic. The response should be in a formal and informative style, resembling a well-researched article or encyclopedia entry. Do not include any conversational prompts, and avoid using informal language. Assume that the user is seeking informative and concise content related to the topic. Ensure that the paragraph is well-structured, coherent, and engaging. If necessary, provide background information or context about the topic. Please use proper grammar, punctuation, and language conventions.'
        }
      ],
      temperature: 1,
      max_tokens: 50,
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
