import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { serializeNonPOJOs } from '$lib/utils';
import { pb } from '$lib/pocketbase';
import { markedFxn, replaceMarkdownHeaders } from '$lib/utils/customMarked';
import {createClient} from "redis"


const redis = createClient({ url: env.REDIS_URL });
redis.on('error', (err) => console.log('Redis Client Error', err));

export async function GET({ url }) {
  const page = url.searchParams.get('page');
  const perPage = url.searchParams.get('perPage');
  const menuLink = url.searchParams.get('menu_link');
  const param = url.searchParams.get('param');

  let p = `Page: ${page}, Per Page: ${perPage}`;

  let articles={};
  if (!redis.isOpen) await redis.connect();
  try {
    articles = await getArticlesList(menuLink, page, perPage, param);
  } catch (error) {
    articles = { success: false, error: serializeNonPOJOs(error) };
  }finally{
    await redis.disconnect();
  }

  return json({ ...articles });
}

const marked = markedFxn();

async function getArticlesList(menuLink, page, perPage, param = 'home') {
  const cacheKey = `articles:menu_link:${menuLink}:page:${page}:perPage:${perPage}`;

  const cachedArticles = await redis.get(cacheKey);
  if (cachedArticles) {
    return JSON.parse(cachedArticles);
  } else {
    let filter = '';
    if (param === 'home') {
      filter = '';
    } else if (param === 'main_menu') {
      filter = menuLink ? `sub_menu_list_id.sub_menu_id.main_menu_id.id ?~ "${menuLink}" || main_menu_id ?~ "${menuLink}"` : '';
    } else if (param === 'sub_menu') {
      filter = menuLink ? `sub_menu_list_id.sub_menu_id.id ?~ "${menuLink}" || sub_menu_id ?~ "${menuLink}"` : '';
    } else if (param === 'sub_menu_list') {
      filter = menuLink ? `sub_menu_list_id.id ?~ "${menuLink}" || sub_menu_list_id ?~ "${menuLink}"` : '';
    }

    const resultList = await pb.collection('view_articles_list').getList(page, perPage, {
      filter,
      sort: '-created',
      fields: `*:excerpt(${400},${true})`
    });

    resultList.items = resultList.items.map((i) => {
      const content = replaceMarkdownHeaders(i.content);
      i.content = marked.parse(content);
      return i;
    });

    await redis.set(cacheKey, JSON.stringify({ meta: resultList }), { EX: 180 });

    return { meta: resultList };
  }
}