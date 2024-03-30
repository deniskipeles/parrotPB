<script>
  import mermaid from "mermaid";
	import { fade } from "svelte/transition";
  import { mermaidRendered } from "$lib/stores";
  import { onMount, afterUpdate } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  onMount(() => loadMermaid());
  afterUpdate(() => loadMermaid());
  
	let val
	mermaid.initialize({ theme: 'neutral', startOnLoad: false })

  const loadMermaid = () => {
    mermaidRendered.set(true)
    try{
      setTimeout(async () => {
        await mermaid.run()
      }, 10)
    }catch(e){
      console.log(e)
    }
  }

  async function loadMermaid1() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js";
      script.onload = () => {
        //mermaid = window.mermaid;
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.append(script);
    });
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
