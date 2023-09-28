import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';

import env from '$env/static/public';
const API_KEY = env?.PUBLIC_PALM_KEY ?? '';

const MODEL_NAME = 'models/text-bison-001';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  // console.log(data);
  if (data?.prompt) {
    const prompt = `${await data.prompt}`;
    try {
      // if (user) {
      //   formData.append('developer_id', user?.id);
      // }
      // const promptString = await formData.get('prompt') as string;
      const res = await ai(prompt);
      console.log(res)
      return json(res);
    } catch (error: any) {
      return json({ success: false, error: serializeNonPOJOs(error) });
    }
  }
}

async function ai(prompt: string) {
  const stopSequences: any = [];

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY)
  });
  return await  client
    .generateText({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.7,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      top_k: 40,
      // optional, for nucleus sampling decoding strategy
      top_p: 0.95,
      // optional, maximum number of output tokens to generate
      max_output_tokens: 4096,
      // optional, sequences at which to stop model generation
      stop_sequences: stopSequences,
      // optional, safety settings
      safety_settings: [
        { category: 'HARM_CATEGORY_DEROGATORY', threshold: 1 },
        { category: 'HARM_CATEGORY_TOXICITY', threshold: 1 },
        { category: 'HARM_CATEGORY_VIOLENCE', threshold: 2 },
        { category: 'HARM_CATEGORY_SEXUAL', threshold: 2 },
        { category: 'HARM_CATEGORY_MEDICAL', threshold: 2 },
        { category: 'HARM_CATEGORY_DANGEROUS', threshold: 2 }
      ],
      prompt: {
        text: prompt
      }
    })
}
