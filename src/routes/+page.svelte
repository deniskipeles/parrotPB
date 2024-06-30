<script>
  //import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  const loadEruda = () => {
		let script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/npm/eruda"
    document.head.append(script);
		script.onload = () => {
      window.eruda.init();
		};
	};
	onMount(()=>{
	  loadEruda()
	  //loadPagepilot()
	  //disableScrollHandling()
	})
  export let data
  
  import ListArticles from '$lib/components/layouts/ListArticles.svelte';
</script>

<ListArticles {data}/>


