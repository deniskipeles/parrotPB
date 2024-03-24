import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').PageLoad} */
export function load({url}) {
    const re_direct = url.pathname
    // console.log(re_direct)
	throw redirect(302,`${re_direct}/1`);
}



