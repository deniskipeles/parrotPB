import { fetchLinks, pb } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = pb;
  event.locals.links = await fetchLinks();

  let theme = '';
  const cookieTheme = event.cookies.get('theme');
  if (cookieTheme) {
    theme = cookieTheme;
  } else {
    event.cookies.set('theme', 'skeleton');
    theme = 'skeleton';
  }
  
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    const collectionName = event.locals.pb.authStore?.model?.collectionName;
    event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection(collectionName)?.authRefresh());
    event.locals.user = structuredClone(event.locals.pb.authStore.model);
  } catch (_) {
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
  });
  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({httpOnly:false}));
  return response;
};
