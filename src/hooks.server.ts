import { fetchLinks, loadCompany, pb } from '$lib/pocketbase';
import type { Handle, RequestEvent } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = pb;
  // load the store data from the request cookie string

  try {
    event.locals.links = await fetchLinks();
    event.locals.company = await loadCompany();
    event = await getCookie(event);
    await event.locals.pb.authStore.loadFromCookie(
      (await event.request.headers.get('cookie')) || ''
    );
  } catch (error) {
    console.log(error);
  }

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
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({ httpOnly: false })
  );
  return response;
};

async function getCookie(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
  const cookie = (await event.request.headers.get('cookie')) ?? '';
  if (cookie) {
    const cookies = await decodeURIComponent(cookie)?.split('; ');
    const pb_auth1 =
      (await cookies?.find((c) => c?.includes('pb_auth1='))?.replace('pb_auth=', '')) ?? '';
    // console.log(pb_auth1);

    // const index_pb_auth = await cookies.findIndex((i) => i.includes('pb_auth='));
    if (pb_auth1) {
      event.cookies.delete('pb_auth');
      event.cookies.set('pb_auth', pb_auth1?.replace('pb_auth1=', ''));
    } else {
      event.cookies.delete('pb_auth');
    }
    // if (index_pb_auth >= 0) {
    //   cookies[index_pb_auth] = pb_auth1;
    // } else {
    //   {
    //     await cookies.push(pb_auth1.replace('pb_auth1=', 'pb_auth='));
    //   }
    // }
    // cookie = await cookies.join('; ');
  }
  return event;
}
