import { fetchLinks, pb, listTablesRecords, listRootsRecords } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';
import {createClient} from "redis"
import { env } from '$env/dynamic/private';

const redis = createClient({ url: env.REDIS_URL });
redis.on('error', (err) => console.log('Redis Client Error', err));

export const handle: Handle = async ({ event, resolve }) => {
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
    if (!redis.isOpen) await redis.connect()
    // Check if the combined object is already cached in Redis
    const cachedData = await redis.get('app-data');
    if (cachedData) {
      // If it is, use the cached response
      const appData = JSON.parse(cachedData);
      event.locals.links = appData?.links ?? [];
      event.locals.tables = appData?.tables ?? [];
      event.locals.roots = appData?.roots ?? [];
      
    } else {
      // If not, fetch the data and cache the combined object in Redis
      let links = []
      let tables = [] 
      let roots = []
      try{
        links=await fetchLinks()
      }catch(e){console.log('links error')}
      try{
        tables=await listTablesRecords()
      }catch(e){console.log('tables error')}
      try{
        roots=await listRootsRecords()
      }catch(e){console.log('roots error')}
        
      const data = { links, tables, roots };
      await redis.set('app-data', JSON.stringify(data), {'EX': 180});
      
      event.locals.links = links;
      event.locals.tables = tables;
      event.locals.roots = roots;
    }
    event.locals.wapp = event.locals?.roots?.length > 0 ? (event.locals.roots.find((obj)=>(obj?.name=="app" || obj?.name=="website" || obj?.name=="home page" || obj?.name=="home" || obj?.name=="page"))) : {};
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
