<script>
  import { onMount } from "svelte";
  import mermaid from "mermaid";
	import { fade } from "svelte/transition";
	
  import { mermaidRendered } from "$lib/stores";
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
