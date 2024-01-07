import { create_links, create_sub_links, fetchLinks } from '$lib/pocketbase';
import { getSubText } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
  try {
    const { pb, ...rest } = locals;
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const resultList = await pb.collection('view_articles_list').getList(Number(page), perPage, {
      sort: '-created',
      // fields: `*:excerpt(${200},${true})`
    });
    resultList['items'] = resultList.items.map((i) => {
      i.content = getSubText(40, i.content);
      return i;
    });
    return { ...rest, meta: resultList };
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

  createLinks: async ({ request, locals }) => {
    const formData = await request.formData();

    const res = await create_links(formData);
    // console.log(JSON.stringify(res))
    const links = await fetchLinks();
    locals.links = links;
    return { ...res, links };
  },
  createSublinks: async ({ request, locals }) => {
    const formData = await request.formData();

    const res = await create_sub_links(formData);
    // console.log(res)
    const links = await fetchLinks();
    locals.links = links;
    return { ...res, links };
  }
};
