import { fetchLinks, pb } from '$lib/pocketbase';
import type { Handle, RequestEvent } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  let theme = '';

  const cookieTheme = event.cookies.get('theme');

  if (cookieTheme) {
    theme = cookieTheme;
  } else {
    event.cookies.set('theme', 'skeleton');
    theme = 'skeleton';
  }

 
  event = await furtherResolve(event);
  
  const exportToCookie = event.locals.pb.authStore.exportToCookie({ httpOnly: false })
  // event.cookies.set('set-cookie', exportToCookie);
  // event.cookies.set('cookie', exportToCookie)
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
  });

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
  response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));
  // response.headers.set('set-cookie', exportToCookie);

  return response;
};







const furtherResolve = async (
  event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
  event.locals.pb = pb;
  event.locals.links = await fetchLinks()
  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    const collectionName = event.locals.pb.authStore?.model?.collectionName;
    // console.log(collectionName);
    event.locals.pb.authStore.isValid &&
      (collectionName == 'developers'
        ? await event.locals.pb.collection('developers')?.authRefresh()
        : await event.locals.pb.collection('clients')?.authRefresh());
    event.locals.user = structuredClone(event.locals.pb.authStore.model);
  } catch (e) {
    // console.log(e);
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }
  // event.request.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
  // event.request.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));
  return event;
};
