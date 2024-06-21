<script lang="ts">
  // +page.ts
  import type { PageData } from '../[page]/$types';
  export let data: PageData
  
  import ListArticles from '$lib/components/layouts/ListArticles.svelte';
</script>

<ListArticles {data}/>

