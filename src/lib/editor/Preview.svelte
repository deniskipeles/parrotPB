<script lang="ts">
  // import { marked } from 'marked';
  // import MathJax from './MathJax.svelte';
  import MermaidDiagram from './MermaidDiagram.svelte';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { afterNavigate } from '$app/navigation';
  // import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  
  import { markedFxn } from "$lib/utils/customMarked"

  export let markdown = '';

  onMount(() => change());
  afterNavigate(() => change());
  
  
  
  const toastStore = getToastStore();
  const change = () => {
    document.querySelectorAll<HTMLButtonElement>('.codeblock-btn').forEach((btn) => {
      if (!btn.classList.contains('btn-mounted')) {
        btn.classList.add('btn-mounted');
        btn.addEventListener('click', () => {
          const codeElement = btn.parentElement?.nextElementSibling?.querySelector('code');
          if (codeElement) {
            const code = codeElement.innerText;
            navigator.clipboard
              .writeText(code)
              .then(() => {
                const t: ToastSettings = { message: 'Code copied to clipboard.' };
                toastStore.trigger(t);
                btn.innerText = 'Copied ✔️👍';
                setTimeout(() => {
                  btn.innerText = "Copy";
                }, 4000);
              })
              .catch((e) => {
                console.log(e);
                const t: ToastSettings = {
                  message: 'Failed to copy to clipboard.',
                  background: 'bg-red-500'
                };
                toastStore.trigger(t);
              });
          }
        });
      }
    });
  };
  
  const marked = markedFxn()
	$: math = marked.parse(markdown)
</script>

<div class="flex w-auto items-center justify-center rounded-md bg-white/5 p-[rfs(50px)] sm:p-5  overflow-x-auto">
<!--
<div class="page-container">
-->
  <article class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
      <MermaidDiagram>
        {@html math}
      </MermaidDiagram>
  </article>
</div>



