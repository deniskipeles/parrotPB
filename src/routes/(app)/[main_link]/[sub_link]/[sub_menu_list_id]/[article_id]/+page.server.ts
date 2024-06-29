
import { error } from '@sveltejs/kit';
import { getArticleById } from '$lib/pocketbase';


/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url, params }) => {
  try {
    const article = url.searchParams.get('article') ?? url.searchParams.get('article_id') ?? params.article_id;
    if (article) {
      // Check if the article is already cached in Redis
      return await getArticleById(article);
    }

    return {};
  } catch (err) {
    error(404, { message: `${err}` });
  }
};
