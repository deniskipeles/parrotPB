import { fetchLinks, pb, listTablesRecords, listRootsRecords } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';
import { redis } from '$lib/utils/redis'


export const handle: Handle = async ({ event, resolve }) => {
  await redis.connect()
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
  try {
    const collectionName = pb.authStore?.model?.collectionId ?? pb.authStore?.model?.collectionName;
    if (pb.authStore.isValid && collectionName) {
      await pb.collection(collectionName)?.authRefresh();
    }
  } catch (_) {
    pb.authStore.clear();
  }

  event.locals.pb = pb;
  event.locals.user = structuredClone(pb.authStore.model);

  try {
    // Check if the combined object is already cached in Redis
    const cachedData = await redis.get('data');
    if (cachedData) {
      // If it is, use the cached response
      const { links, tables, roots } = JSON.parse(cachedData);
      event.locals.links = links;
      event.locals.tables = tables;
      event.locals.roots = roots;
    } else {
      // If not, fetch the data and cache the combined object in Redis
      const [links, tables, roots] = await Promise.all([
        fetchLinks(),
        listTablesRecords(),
        listRootsRecords()
      ]);
      const data = { links, tables, roots };
      await redis.set('data', JSON.stringify(data), 'EX', 180);
      event.locals.links = links;
      event.locals.tables = tables;
      event.locals.roots = roots;
    }

    event.locals.wapp = event.locals.roots.length > 0 ? (event.locals.roots.find((obj)=>(obj?.name=="app" || obj?.name=="website" || obj?.name=="home page" || obj?.name=="home" || obj?.name=="page"))) : {};
  } catch (err) {
    error(404, { message: `${err}` });
  }

  let theme = 'vintage';
  const cookieTheme = event.cookies.get('theme');
  if (cookieTheme) {
    theme = cookieTheme;
  } else {
    event.cookies.set('theme', 'skeleton', { path: '/', httpOnly: false });
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
