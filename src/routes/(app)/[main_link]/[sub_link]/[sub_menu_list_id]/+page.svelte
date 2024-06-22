<script>
  export let data
  
  import ListArticles from '$lib/components/layouts/ListArticles.svelte';
</script>

<ListArticles {data}/>
{JSON.stringify(data)}
