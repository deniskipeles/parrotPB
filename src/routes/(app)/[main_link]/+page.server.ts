import { pb } from '$lib/pocketbase';
import { getSubText, serializeNonPOJOs } from '$lib/utils';
import type { RouteParams } from '../$types';
import { markedFxn } from "$lib/utils/customMarked"
const marked = markedFxn()

export async function load({ params, url, parent }) {
  try {
    const parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    
    const filter = `sub_menu_list_id.sub_menu_id.main_menu_id.id ?~ "${params?.main_link}"`;
    const resultList = await pb
      .collection('articles')
      .getList(page, perPage, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${400},${true})`
      });

    resultList['items'] = resultList.items.map((i) => {
      i.content = marked.parse(i?.content);
      return i;
    });

    const _page = () => {
      const items = resultList.items.map((item) => {
        return {
          title: getSubText(4, item?.title)?.replaceAll('&amp;', '&'),
          decription: getSubText(10, item?.content)?.replaceAll('&amp;', '&')
        };
      });
      const title = items.map((i) => i?.title).join(' ');
      const description = items.map((i) => i?.decription).join('  ');
      return { title, description };
    };

    return { meta: resultList, _page: _page() };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
}

