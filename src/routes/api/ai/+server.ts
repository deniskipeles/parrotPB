import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';

import { PUBLIC_PALM_KEY } from '$env/static/public';
import { pb } from '$lib/pocketbase';
// import type { google } from '@google-ai/generativelanguage/build/protos/protos';
import { GoogleGenerativeAI } from '@google/generative-ai';
const API_KEY = PUBLIC_PALM_KEY ?? '';


export async function GET() {
	return json({"get":"this is ai endpoint"});
}

const MODEL_NAME = 'models/text-bison-001';
// const MODEL_NAME = 'models/gemini-pro';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  // console.log(data);
  if (data?.prompt) {
    const prompt = `${await data.prompt}`;
    try {
      const res = await ai(prompt);
      console.log(res);
      return json(res);
    } catch (error: unknown) {
      console.log(error);
      return json({ success: false, error: serializeNonPOJOs(error) });
    }
  }
}

type InputPrompt = {
  prompt: string;
  key: string | null;
  url: string;
  type: string;
  info: unknown;
};

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
  try {
    const data: InputPrompt = await request.json();
    if (!data.key && !data.url) {
      return json({
        success: false,
        error: new Error(
          'Please provide the ai key from ktechs.\n Or obtain one to resolve this issue.'
        )
      });
    }

    if (data.key || data.url) {
      const record = await pb
        .collection(data.type)
        .getFirstListItem(`key="${data.key}"|| urls~"${data.url}"`, {})
        .then(async (value) => value);
      if (!record) {
        return json({
          success: false,
          error: new Error('Please register with ktechs as a client to obtain an ai key.')
        });
      }
      if (new Date(record?.expiry_date).getTime < new Date(Date.now()).getTime) {
        return json({
          success: false,
          error: new Error(
            'Failed to prompted ai. \nPlease renew your ai subscription with ktechs.\n Or obtain one to resolve this issue.'
          )
        });
      }
    }
    if (data?.prompt) {
      const prompt = `${await data.prompt}`;

      // const res: [
      //   google.ai.generativelanguage.v1beta2.IGenerateTextResponse,
      //   google.ai.generativelanguage.v1beta2.IGenerateTextRequest | undefined,
      //   Record<string, never> | undefined
      // ] = await ai(prompt);
      const res = await ai(prompt);
      try {
        if (typeof res == 'string' && res.length > 1) {
          await pb
            .collection('ai_queries')
            .create({ url: data.url, prompt: data.prompt, type: data.type, data: res });
        }
      } catch (error) {
        // eslint-disable-next-line no-ex-assign
        error = '';
      }

      return json(res);
    }
    return json('no prompt prvided');
  } catch (error: unknown) {
    return json({ success: false, error: serializeNonPOJOs(error) });
  }
}

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(PUBLIC_PALM_KEY);
async function ai(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // const prompt = 'Write a story about a magic backpack.';

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
async function aiOld(prompt: string) {
  const stopSequences: string[] = [];

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY)
  });
  return await client
    .generateText({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.7,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      // topK: 40,
      // // optional, for nucleus sampling decoding strategy
      // topP: 0.95,
      // // optional, maximum number of output tokens to generate
      // maxOutputTokens: 4096,
      // // optional, sequences at which to stop model generation
      // stopSequences: stopSequences,
      // // optional, safety settings
      // safetySettings: [
      //   { category: 'HARM_CATEGORY_DEROGATORY', threshold: 1 },
      //   { category: 'HARM_CATEGORY_TOXICITY', threshold: 1 },
      //   { category: 'HARM_CATEGORY_VIOLENCE', threshold: 2 },
      //   { category: 'HARM_CATEGORY_SEXUAL', threshold: 2 },
      //   { category: 'HARM_CATEGORY_MEDICAL', threshold: 2 },
      //   { category: 'HARM_CATEGORY_DANGEROUS', threshold: 2 }
      // ],
      prompt: {
        text: prompt
      }
    })
    .then((res) => {
      console.log(JSON.stringify(res));
      return res;
    });
}
