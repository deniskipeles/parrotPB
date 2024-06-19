import { create_links, fetchLinks, pb } from '$lib/pocketbase';
import { getSubText, serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

import { markedFxn,replaceMarkdownHeaders } from "$lib/utils/customMarked"
const marked = markedFxn()

/** @type {import('./$types').PageLoad} */
export const load = async ({ url }) => {
  try {
    const article = url.searchParams.get('article');
    if(article){
      const res = await getArticle(article);
      return res;
    }
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const resultList = await pb.collection('view_articles_list').getList(Number(page), perPage, {
      sort: '-created',
      fields: `*:excerpt(${400},${true})`
    });
    resultList['items'] = resultList.items.map((i) => {
      //i.content = getSubText(40, i.content);
      const content = replaceMarkdownHeaders(i.content)
      i.content = marked.parse(content);
      return i;
    });
    return { meta: resultList };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};

export const actions: Actions = {
  // This action is called when the user clicks the theme button
  setTheme: async ({ cookies, request }) => {
    const formData = await request.formData();
    const theme = formData.get('theme')?.toString() ?? 'skeleton';
    // Sets the selected theme to the cookie
    cookies.set('theme', theme, { path: '/' });
    return { theme };
  },

  createLinks: async ({ request parent }) => {
    const formData = await request.formData();

    const res = await create_links(formData);
    // console.log(JSON.stringify(res))
    const links = await fetchLinks();
    const dt = await parent();
    return { ...res, links, dt };
  }
};






async function getArticle(article_id='') {
  try {
    let article = await pb.collection('articles').getOne(article_id, {
      expand: 'developer_id'
    });

    let tags: string[] = [];
    if (Array.isArray(article?.tags)) {
      tags = article?.tags;
    } else if (typeof article?.tags == 'string') {
      tags = [article?.tags];
    } else {
      tags = [JSON.stringify(article?.tags)];
    }
    const tags_filter = tags.map((i) => `tags ?~ "${i}"`)?.join(' || ');
    let recommended = (
      await pb.collection('view_articles_list').getList(1, 5, {
        filter: `(${tags_filter}) && id != "${article?.id}"`,
        sort: '-created',
        "fields":`*:excerpt(${400},${true})`
      })
    ).items;
    recommended = recommended.map((i) => {
      const content = replaceMarkdownHeaders(i.content)
      i.content = marked.parse(content);
      return i;
    });
    article = serializeNonPOJOs(article)
    return { article , recommended };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}


