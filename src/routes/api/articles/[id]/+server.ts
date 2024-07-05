import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { serializeNonPOJOs } from '$lib/utils';
import { pb } from '$lib/pocketbase';
import { markedFxn, replaceMarkdownHeaders } from '$lib/utils/customMarked';
import {createClient} from "redis"


const redis = createClient({ url: env.REDIS_URL });
redis.on('error', (err) => console.log('Redis Client Error', err));

export async function GET({ url,params,locals }) {
  const {pb,...rest}=locals;
  const id = params.id ?? url.searchParams.get('id');

  let p = `Page: ${id}`;

  let article=null;
  if (!redis.isOpen) await redis.connect();
  try {
    article = await getArticleById(id);
  } catch (error) {
    article = { success: false, error: serializeNonPOJOs(error) };
  }finally{
    await redis.disconnect();
  }
  //check article field premium and user is not logined in then return empty article,rest and login is true else return article,rest and login false
  if(article?.article?.premium && !rest?.user){
    return json({ ...rest,allowed:false });
  }else{
    return json({ ...rest,allowed:true,...article });
  }
}

const marked = markedFxn();

async function getArticleById(article_id='') {
  if (!redis.isOpen) await redis.connect()
  try {
    const cachedArticle = await redis.get(`article:${article_id}`);
    if (cachedArticle) {
        // If it is, use the cached response
        return JSON.parse(cachedArticle);
      } else {
        let article = await pb.collection('view_articles_list').getOne(article_id, {
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

        await redis.set(`article:${article_id}`, JSON.stringify(res), {'EX': 1800});

        return res;
      }
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}