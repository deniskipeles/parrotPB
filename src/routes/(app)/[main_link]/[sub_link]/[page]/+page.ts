import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { RecordModel } from 'pocketbase';
import type { RouteParams } from '../$types';
import { getBlogList } from './blog-service';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, parent }) {
  try {
    const parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const category_id = getCategory({ data: parentData }, params);
	const filter = `category_id = "${category_id}"`
    const resultList = await pb
      .collection('view_articles_list')
      .getList(Number(params.page ?? 1), perPage, {
        filter,
      });
	//   && category_id = ${category_id}
    return { meta: resultList };
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
