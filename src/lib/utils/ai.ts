import { serializeNonPOJOs } from '$lib/utils';
import { TextServiceClient, DiscussServiceClient, v1beta2 } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
// import { API_KEY } from '$env/static/public';
const API_KEY = 'AIzaSyCfFLgcO9L1QHaE7Mqgs2Bswa5YT7hUWAQ';

const MODEL_NAME = 'models/text-bison-001';

export function aiRequest(prompt: string) {
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY)
  });

  try {
    const stopSequences: any = [];

    client
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
          text: prompt ?? 'write a random article about programming'
        }
      })
      .then((record) => {
        // console.log(JSON.stringify(record, null, 2));
        // record = serializeNonPOJOs(record);
        // console.log(JSON.stringify(record));
        return { record };
      });
  } catch (error: any) {
    return { success: false, error: serializeNonPOJOs(error) };
  }
}
