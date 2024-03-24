<script>
  import { onMount, afterUpdate } from 'svelte';

  export let txt = `
### Moore Street
\`\`\`mermaid
graph LR
Monomer1 --> Chain(Round)  
Monomer2 --> Chain  
Monomer3 --> Chain
\`\`\`
`;

  onMount(() => {
    //loadEditor();
  });

 // afterUpdate(() => loadEditor());
	let val

  function loadEditor(params=true) {
    loadMermaid().then(() => {
      if (window.Stackedit) {
        const stackedit = new window.Stackedit();

        //const el = document.querySelector('textarea');

				const el = document.getElementById('txt');

        stackedit.openFile({
          name: 'Filename', // with an optional filename
          content: {
            text: el.value // and the Markdown content.
          }
        });

        stackedit.on('fileChange', (file) => {
          el.value = file.content.text;
        });
      }
    });
  }

  async function loadMermaid() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/stackedit-js@1.0.7/docs/lib/stackedit.min.js";
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

<textarea id="txt" bind:value={txt} hidden="true"></textarea>
<button type="button" class="btn variant-filled" on:click={()=>loadEditor(false)}>Use Stackedit</button>


