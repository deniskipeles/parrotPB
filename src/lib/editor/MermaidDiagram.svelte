<script>
  import mermaid from "mermaid";
	import { fade } from "svelte/transition";
  import { mermaidRendered } from "$lib/stores";
  import { onMount, afterUpdate } from 'svelte';

  //onMount(() => loadDiagrams());
  //afterUpdate(() => loadDiagrams());
	let val
	mermaid.initialize({ theme: 'neutral', startOnLoad: false })
  onMount(() => {
    mermaidRendered.set(true)
    setTimeout(async () => {
      await mermaid.run()
    }, 0)
  })

  function loadDiagrams() {
    loadMermaid().then(() => {
      mermaidRendered.set(true)
      mermaid = window.mermaid;
      if (mermaid) {

        mermaid.initialize({ theme: 'forest', startOnLoad: false })
      
        setTimeout(async () => {
          await mermaid.run({
            suppressErrors:true
          })
        }, 0)

      }
    });
  }

  async function loadMermaid() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js";
      script.onload = () => {
        mermaid = window.mermaid;
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
