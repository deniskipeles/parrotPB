
import { create_links, fetchLinks, pb as pb_ } from '$lib/pocketbase';
import { getSubText, serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

import { markedFxn,replaceMarkdownHeaders } from "$lib/utils/customMarked"
const marked = markedFxn()

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url, params }) => {
  try {
    const { pb, ...rest } = locals;
    const article = url.searchParams.get('article');
    if(article){
      const res = await getArticle(article);
      return res;
    }
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const menu_filter = params?.main_link ?? url.searchParams.get('main_link') ?? ''
    const filter = `sub_menu_list_id.sub_menu_id.main_menu_id.id ?~ "${menu_filter}"`;
    const resultList = await pb.collection('view_articles_list').getList(Number(page), perPage, {
      filter,
      sort: '-created',
      fields: `*:excerpt(${400},${true})`
    });
    resultList['items'] = resultList.items.map((i) => {
      //i.content = getSubText(40, i.content);
      const content = replaceMarkdownHeaders(i.content)
      i.content = marked.parse(content);
      return i;
    });
    return { ...rest, meta: resultList };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};





async function getArticle(article_id='') {
  try {
    let article = await pb_.collection('articles').getOne(article_id, {
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
      await pb_.collection('view_articles_list').getList(1, 5, {
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




