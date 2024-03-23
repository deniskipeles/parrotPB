<!-- MermaidDiagram.svelte -->
<pre>
  <code class="mermaid">
    {diagramCode}
  </code>
</pre>

<script>
  import { onMount, afterUpdate as onUpdate } from 'svelte';

  export let diagramCode = `graph LR\nA--->B`;
  let codeElement;
  let mermaidElement;
  let mermaid;

  async function loadMermaid() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.0.0/mermaid.min.js";
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

  onMount(async () => {
    try {
      await loadMermaid();
      const config = {
        startOnLoad: true,
        theme: 'forest',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
      };

      mermaid.initialize(config);
      mermaid.init(undefined, codeElement);
      renderDiagram();
    } catch (error) {
      console.error('Error loading Mermaid:', error);
    }
  });

  onUpdate(() => {
    renderDiagram();
  });

  function renderDiagram() {
    if (mermaidElement && mermaid) {
      mermaidElement.innerHTML = '';
      mermaid.render('mermaidElement', diagramCode, function (svgCode) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid';
        wrapper.innerHTML = svgCode;
        mermaidElement.appendChild(wrapper);
      });
    }
  }
</script>
