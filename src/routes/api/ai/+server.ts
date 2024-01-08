import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';

import { PUBLIC_PALM_KEY } from '$env/static/public';
import { pb } from '$lib/pocketbase';
import { GoogleGenerativeAI } from '@google/generative-ai';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const searchParams = url.searchParams;
  const queryParams: Record<string, any> = {};

  // Loop through the search parameters and populate the object
  searchParams.forEach((value, key) => {
    // Convert values to JSON if needed (e.g., handle numbers, booleans)
    try {
      queryParams[key] = JSON.parse(value);
    } catch (error) {
      // If parsing fails, assign the raw string value
      queryParams[key] = value;
    }
  });

  try {
    const data = queryParams;
    if (!data.key && !data.url) {
      return json({
        success: false,
        error: 'Please provide the AI key from ktechs or obtain one to resolve this issue.'
      });
    }

    if (data.key || data.url) {
      const record =
        (await pb.collection(data.type).getFirstListItem(`key="${data.key}"`)) ??
        (await pb.collection(data.type).getFirstListItem(`urls~="${data.url}"`));
      if (!record) {
        return json({
          success: false,
          error: 'Please register with ktechs as a client to obtain an AI key.'
        });
      }

      const aiPaymentExpiryDate = new Date(record?.ai_payment_expiry_date).getTime();
      const currentDate = new Date().getTime();

      if (record && (aiPaymentExpiryDate > currentDate || record.number_of_ai_queries < 500)) {
        return json({
          queryParams,
          success: true,
          data: PUBLIC_PALM_KEY
        });
      } else {
        return json({
          queryParams,
          success: true,
          data: 'Failed to prompt AI.\nPlease renew your AI subscription with ktechs or subscribe to one to resolve this issue.'
        });
      }
    }

    return json({ success: false, error: 'No prompt provided.' });
  } catch (error) {
    return json({ success: false, error: serializeNonPOJOs(error) });
  }
}

const MODEL_NAME = 'gemini-pro';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  if (data?.prompt) {
    const prompt = `${await data.prompt}`;
    try {
      const res = await ai(prompt);
      return json(res);
    } catch (error: unknown) {
      return json({ success: false, error: serializeNonPOJOs(error) });
    }
  }
}

type Input = {
  prompt: string;
  key: string | null;
  url: string;
  type: string;
  info: unknown;
};

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
  try {
    const data: any = await request.json();
    if (!data.key && !data.url) {
      return json({
        success: false,
        error: 'Please provide the ai key from ktechs.\n Or obtain one to resolve this issue.'
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
          error: 'Please register with ktechs as a client to obtain an ai key.'
        });
      }
      if (
        record &&
        new Date(record?.expiry_date).getTime < new Date(Date.now()).getTime &&
        record.number_of_queries > 500
      ) {
        return json({
          success: false,
          error:
            'Failed to prompted ai. \nPlease renew your ai subscription with ktechs.\n Or subscribe to one to resolve this issue.'
        });
      }
    }
    if (data?.prompt) {
      const prompt = `${data.prompt}`;

      const res = await ai(prompt);
      if (!res) {
        return json({ success: false, error: 'no response from ai try again.' });
      }
      try {
        if (typeof res == 'string' && res.length > 1) {
          await pb.collection('ai_queries').create({
            url: data.url,
            prompt: data.prompt,
            server_url: data.server_url,
            request_id: data.request_id,
            type: data.type,
            data: res
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-ex-assign
        error = '';
      }

      return json({ success: true, data: res });
    }
    return json({ success: false, error: 'no prompt provided' });
  } catch (error: unknown) {
    return json({ success: false, error: serializeNonPOJOs(error) });
  }
}

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(PUBLIC_PALM_KEY);
async function ai(prompt: string) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
