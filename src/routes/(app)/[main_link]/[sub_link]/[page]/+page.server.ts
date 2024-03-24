import { pb } from '$lib/pocketbase';
import { getSubText, serializeNonPOJOs } from '$lib/utils';
import type { RouteParams } from '../$types';

export async function load({ params, url, parent }) {
  try {
    const parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const category_id = getCategory({ data: parentData }, params);
    const filter = `category_id = "${category_id}"`;
    const resultList = await pb
      .collection('view_articles_list')
      .getList(Number(params.page ?? 1), perPage, {
        filter,
        sort: '-created',
        // fields: `*:excerpt(${200},${true})`
      });

    resultList['items'] = resultList.items.map((i) => {
      i.content = getSubText(40, i.content);
      return i;
    });

    const _page = () => {
      const items = resultList.items.map((item) => {
        return {
          title: getSubText(4, item?.title)?.replaceAll('&amp;', '&'),
          decription: getSubText(10, item?.content)?.replaceAll('&amp;', '&')
        };
      });
      const title = items.map((i) => i.title).join(' ');
      const description = items.map((i) => i.decription).join('  ');
      return { title, description };
    };

    return { meta: resultList, _page: _page() };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}

function getCategory(page: any, params: RouteParams) {
  let obj_id: any = null;
  page.data?.links[`/${params.main_link}`]?.forEach((elem: any) => {
    const links = elem?.list;
    if (Array.isArray(links)) {
      obj_id = links.find((e) => e?.href == `/${params?.sub_link}`)?.id;
    }
  });

  return obj_id;
}
