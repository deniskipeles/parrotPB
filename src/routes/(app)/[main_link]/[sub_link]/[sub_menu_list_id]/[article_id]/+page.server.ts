
import { error } from '@sveltejs/kit';


/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url, params, fetch }) => {
  try {
    const article = url.searchParams.get('article') ?? url.searchParams.get('article_id') ?? params.article_id;
    if (article) {
      const articleData = await fetch(`/api/articles/${article}`).then((res) => res.json());
      return articleData
    }

    return {};
  } catch (err) {
    error(404, { message: `${err}` });
  }
};
