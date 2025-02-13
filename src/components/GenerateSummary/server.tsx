"use server";

import OpenAI from "openai";


export async function getSummaryFromOpenAi(content: string) {

  if (!content) {
    return;
  }

  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: `Please create a summary of the following text, no longer than 30 words: ${content}`,
        },
    ],
    store: true,
  });

  return completion!.choices[0]?.message.content || '';

}