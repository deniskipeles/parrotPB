<script>
  import { page } from '$app/stores';
  export let data
  
  import ListArticles from '$lib/components/layouts/ListArticles.svelte';
</script>

<ListArticles {data}/>
{JSON.stringify(data.links)}
{JSON.stringify($page.data.links)}
