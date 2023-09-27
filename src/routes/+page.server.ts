
import { create_links, fetchLinks } from '$lib/pocketbase';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  try {
      const { pb, ...rest } = locals;
  
      // console.log(res,rest)
      return {
          ...rest,
      };
      
  } catch (error) {
      console.error(`Error in load function for : ${error}`);
  return {};
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

  createSublinks: async ({ request, locals }) => {
    const formData = await request.formData();

    const res = await create_links(formData);
    // console.log(res)
    const links = await fetchLinks();
    locals.links = links
    return { ...res, links };
  }
};
