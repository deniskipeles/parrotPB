
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url, params, fetch }) => {
  let resultList = {};
  try {
    const article = url.searchParams.get('article') ?? url.searchParams.get('article_id');
    
    if (article) {
      const articleData = await fetch(`/api/articles/${article}`).then((res) => res.json());
      return articleData
    }

    // Fetch the list of articles
    const mainLink = params?.sub_menu_list_id ?? url.searchParams.get('sub_menu_list_id') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
     resultList = await fetch(`/api/articles?menu_link=${mainLink}&page=${page}&perPage=${perPage}&param=sub_menu_list`).then((res) => res.json());
    //console.log(resultList);
    return { ...resultList };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};

