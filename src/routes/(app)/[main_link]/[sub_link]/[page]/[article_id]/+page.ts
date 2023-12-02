import { pb } from '$lib/pocketbase';
import { getSubText, serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try {
    let article = await pb.collection('articles').getOne(params.article_id, {
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
        filter: `(${tags_filter}) && id != "${article?.id}"`
        // "fields":`*:excerpt(${400},${true})`
      })
    ).items;
    recommended = recommended.map((i) => {
      i.content = getSubText(100, i.content);
      return i;
    });
    article = serializeNonPOJOs(article)
    return { article , recommended };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}
