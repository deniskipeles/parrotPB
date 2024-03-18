import { fetchLinks, loadCompany, pb, listTablesRecords, listRootsRecords } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';
import { getRelatedCollections } from '$lib/utils';


export const handle: Handle = async ({ event, resolve }) => {
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    const collectionName = pb.authStore?.model?.collectionName;
    if (pb.authStore.isValid && collectionName) {
      await pb.collection(collectionName)?.authRefresh();
    }
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  event.locals.pb = pb;
  event.locals.user = structuredClone(pb.authStore.model);
  try {
    	// this are page builders and are necessary else it return an error page
	event.locals.links = await fetchLinks()
	event.locals.tables = await listTablesRecords();
	event.locals.roots = await listRootsRecords();
	  
		
    	// load the store data from the request cookie string
	/*const collections = events.locals.tables; // assuming the JSON data is stored in a variable called 'json'

	const mainMenu = collections.find(collection => collection.name === 'main_menu');
	const relatedCollections = getRelatedCollections(mainMenu, collections);
    	*/
	
		
    	event.locals.company = await loadCompany();
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

  // Apply CORS header for API routes
  if (event.url.pathname.startsWith('/api/ai')) {
    // Required for CORS to work
    if(event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
  });
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({ httpOnly: false })
  );

  if (event.url.pathname.startsWith('/api/ai')) {
      response.headers.append('Access-Control-Allow-Origin', `*`);
  }
  return response;
};
