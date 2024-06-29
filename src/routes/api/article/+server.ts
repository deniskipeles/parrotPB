import { createArticles } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user } }) {
  const formData = await request.formData();
  try {
    if (user) {
      formData.append('author_id', user?.id);
    }

    let record = await createArticles(formData);

    record = serializeNonPOJOs(record);
    
    return json(record);
  } catch (error: any) {
    return json({ success: false, error: serializeNonPOJOs(error) });
  }
}
