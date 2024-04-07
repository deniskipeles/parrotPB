<script>
  import mermaid from "mermaid";
	import { fade } from "svelte/transition";
  import { mermaidRendered } from "$lib/stores";
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  onMount(() => loadMermaid());
  afterNavigate(() => loadMermaid());
  
	let val

  const loadMermaid = () => {
    mermaidRendered.set(true)
	  mermaid.initialize({ theme: 'forest', startOnLoad: false })
	  
    try{
      setTimeout(async () => {
        await mermaid.run()
      }, 0)
    }catch(e){
      console.log(e)
    }
  }
</script>


{#if $mermaidRendered}
  <div>
    <slot />
  </div>
  {:else}
  <div out:fade={{ duration:300 }} class="placeholder">
    Loading...
  </div>
{/if}
