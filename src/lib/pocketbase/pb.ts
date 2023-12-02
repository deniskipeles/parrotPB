import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

const isDev = import.meta.env.MODE === 'development';
let url = 'http://127.0.0.1:8090'
if (!isDev && PUBLIC_POCKETBASE_URL) {
	// url = import.meta.env?.PUBLIC_POCKETBASE_URL;
	url = PUBLIC_POCKETBASE_URL;
}
const pb = new PocketBase(url);
const currentUser = writable(pb.authStore.model);
// pb.authStore.onChange((auth) => {
// 	// console.log('authStore changed', auth);
// 	currentUser.set(pb.authStore.model);
// });

export{pb,currentUser}