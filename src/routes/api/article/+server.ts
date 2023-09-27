import { createArticles } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user } }) {
  const formData = await request.formData();
  try {
    if (user) {
      formData.append('developer_id', user?.id);
    }

    // const main = formData.get('main_link') as string;
    // const sub = formData.get('sub_link') as string;

    let record = await createArticles(formData);

    record = serializeNonPOJOs(record);
    console.log(JSON.stringify(record));
    return json(record);
  } catch (error: any) {
    return json({ success: false, error: serializeNonPOJOs(error) });
  }
}
