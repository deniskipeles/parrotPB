/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {

	// interface PageData {}
	interface Locals {
		userid: string;
		links: import('pocketbase').RecordModel[];
		pb: import('pocketbase').default;
		user: import('pocketbase').default['authStore']['model'];
		wapp: import('pocketbase').RecordModel|{ [key: string]: any } | null;
		tables: import('pocketbase').RecordModel[];
		roots: import('pocketbase').RecordModel[];
	}

	// interface Error {}

	// interface Platform {}
}
