import { groupByKey, serializeNonPOJOs } from '$lib/utils';
import { pb } from '../pb';
import { markedFxn, replaceMarkdownHeaders } from "$lib/utils/customMarked";
import { redis } from '$lib/utils/redis';

const marked = markedFxn();


export async function getArticlesList(menu_link, page, perPage,param="/") {
  // Include the menu_link parameter in the cache key
  await redis.connect()
  const cacheKey = `articles:menu_link:${menu_link}:page:${page}:perPage:${perPage}`;

  // Check if the list of articles is already cached in Redis
  const cachedArticles = await redis.get(cacheKey);
  if (cachedArticles) {
    // If it is, use the cached response
    return JSON.parse(cachedArticles);
  } else {
    // If not, fetch the list of articles and cache the response in Redis
    let filter = '';
    if(param=="home"){
      filter = '';
    }
    if(param=="main_menu"){
      filter = menu_link ? `sub_menu_list_id.sub_menu_id.main_menu_id.id ?~ "${menu_link}" || main_menu_id ?~ "${menu_link}"` : '';
    }
    if(param=="sub_menu"){
      filter = menu_link ? `sub_menu_list_id.sub_menu_id.id ?~ "${menu_link}" || sub_menu_id ?~ "${menu_link}"` : '';
    }
    if(param=="sub_menu_list"){
      filter = menu_link ? `sub_menu_list_id.id ?~ "${menu_link}" || sub_menu_list_id ?~ "${menu_link}"` : '';
    }
    const resultList = await pb.collection('view_articles_list').getList(page, perPage, {
      filter,
      sort: '-created',
      fields: `*:excerpt(${400},${true})`
    });
    resultList['items'] = resultList.items.map((i) => {
      const content = replaceMarkdownHeaders(i.content)
      i.content = marked.parse(content);
      return i;
    });
    await redis.set(cacheKey, JSON.stringify({ meta: resultList }), 'EX', 180);
    return resultList;
  }
}


export async function getArticleById(article_id='') {
  await redis.connect()
  try {
    const cachedArticle = await redis.get(`article:${article_id}`);
    if (cachedArticle) {
        // If it is, use the cached response
        return JSON.parse(cachedArticle);
      } else {
        let article = await pb.collection('articles').getOne(article_id, {
          expand: 'author_id'
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
        const res = { article , recommended };
        
        await redis.set(`article:${article_id}`, JSON.stringify(res), 'EX', 18000);
        return res;
      }
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}


export const createArticles = async (data: any) => {
  try {
    let record = await pb.collection('articles').create(data);
    record = serializeNonPOJOs(record);
    return { record };
  } catch (error) {
    console.log(error)
    return { error: serializeNonPOJOs(error) };
  }
};

export const fetchArticles = async () => {
  try {
    // you can also fetch all records at once via getFullList
    let records = await pb.collection('articles').getList(1, 50, {
      sort: '-created'
    });
    records = serializeNonPOJOs(records);
    return records;
  } catch (error) {
    return {error: serializeNonPOJOs(error)};
  }
};
