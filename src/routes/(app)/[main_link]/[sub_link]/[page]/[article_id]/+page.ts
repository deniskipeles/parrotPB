import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try {
    const record = await pb.collection('articles').getOne(params.article_id, {
      expand: 'developer_id'
    });
    // console.log(JSON.stringify(record))
    return { article: serializeNonPOJOs(record) };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}
