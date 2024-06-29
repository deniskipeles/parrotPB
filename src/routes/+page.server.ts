
import { error } from '@sveltejs/kit';
import { getArticleById,getArticlesList } from '$lib/pocketbase';


/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url, params }) => {
  try {
    const article = url.searchParams.get('article') ?? url.searchParams.get('article_id');
    if (article) {
      // Check if the article is already cached in Redis
      return await getArticleById(article);
    }

    // Fetch the list of articles
    const main_link = 'home';
    const page = Number(url.searchParams.get('page') ?? 1);
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const resultList = await getArticlesList(main_link, page, perPage, "home");
    return { meta: resultList };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};
