<script lang="ts">
  import { marked } from 'marked';
  import MathJax from './MathJax.svelte';
  import MermaidDiagram from './MermaidDiagram.svelte';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { afterNavigate } from '$app/navigation';
  // import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

  export let markdown = '';

  let toBeCalled = true;
  onMount(() => {
    change()
  });
  afterNavigate(() => {
    change()
  });
  
  
  
  
  
  // Local
  function injectTailwindClasses(classesObj) {
    // Iterate through the object keys
    for (const [element, classes] of Object.entries(classesObj)) {
      // Get all elements matching the tag name inside <article>
      const elements = document.querySelectorAll("article " + element);
  
      // Iterate through each element
      for (let i = 0; i < elements.length; i++) {
        // Split the classes string into an array and filter out empty strings
        const classesArray = classes.split(" ").filter((c) => c.trim());
  
        // Add each class to the element
        for (const cssClass of classesArray) {
            elements[i].classList.add(cssClass);
        }
      }
    }
  }

  const tailwindClasses = {
    h1: "h1 text-3xl mb-4",
    h2: "h2 text-2xl mb-4",
    h3: "h3 text-xl mb-4",
    h4: "h4 text-lg mb-4",
    h5: "h5 text-base mb-4",
    h6: "h6 text-sm mb-4",
    p: "p mb-4",
    a: "a anchor text-blue-500 underline hover:no-underline",
    //ul: "list list-disc",
    //ol: "list list-decimal",
    //li: "text-xs",
    blockquote: "blockquote italic border-l-4 border-gray-300 pl-4 mb-4",
    pre: "pre",
    // code: "code bg-gray-100 px-1 rounded",
    img: "img w-auto mb-4",
    table: "table table-hover",
    th: "th font-bold bg-gray-100 px-4 py-2",
    td: "td px-4 py-2",
    strong: "strong font-bold",
    em: "em italic",
    hr: "hr border-gray-300 mb-4",
    //button: "button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700",
    input: "input border border-gray-300 rounded py-2 px-4 w-full",
    textarea: "textarea border border-gray-300 rounded py-2 px-4 w-full",
    select: "select border border-gray-300 rounded py-2 px-4 w-full",
    label: "label font-bold mb-2",
    form: "form",
    fieldset: "fieldset border border-gray-300 rounded px-4 py-2 mb-4",
    legend: "legend font-bold mb-2",
    iframe: "iframe w-full h-auto mb-4",
    figure: "figure mb-4",
    figcaption: "figcaption italic mb-4",
    cite: "cite italic",
    q: "q italic",
    sup: "sup text-xs font-normal",
    sub: "sub text-xs font-normal",
    small: "small text-xs font-normal",
    mark: "mark bg-yellow-200 px-1 rounded",
    del: "del line-through text-gray-500",
    ins: "ins underline ",
    time: "time ",
    abbr: "abbr border-b border-dotted ",
    acronym: "acronym border-b border-dotted ",
    address: "address ",
    caption: "caption font-bold mb-2",
    //code: "code bg-gray-100 px-1 rounded",
    dd: "dd mb-2",
    dt: "dt font-bold mb-2",
    kbd: "kbd bg-gray-100 px-1 rounded",
    samp: "samp bg-gray-100 px-1 rounded",
    var: "var italic",
    // Add more elements and their corresponding Tailwind classes here
  };
  
  const toastStore = getToastStore();
  const change = () => {
    // Call the function to inject Tailwind classes into the HTML elements
    injectTailwindClasses(tailwindClasses)
    numbering()
    tableJsInjection()
    // CodeBlock Highlight
    document.querySelectorAll<HTMLPreElement>('pre code').forEach((elem, index) => {
      const btn = document.createElement('button');
      btn.innerText = ' Copy ';
      btn.classList.add('btn');
      btn.classList.add('variant-filled');
      // btn.style.backgroundColor = '#f0f0f0';
      btn.addEventListener('click', () => {
        const code = elem.innerText;
        navigator.clipboard
          .writeText(code)
          .then(() => {
            const t: ToastSettings = { message: 'Code copied to clipboard.' };
            toastStore.trigger(t);
            btn.innerText = 'Copied ✔️';
            // console.log(code);
            setTimeout(() => {
              btn.innerText = 'Copy';
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
      });
      if (!elem.parentNode?.querySelector('button')) {
        elem.parentNode?.prepend(btn);
      }
      if (!elem.classList.contains('mermaid')) {
        hljs.highlightElement(elem);
      }
    });
    
    document.querySelectorAll<HTMLPreElement>('pre.mermaid')?.forEach((elem, index) => {
      elem.classList.remove('pre');
    });
    
  };

  function tableJsInjection() {
    const tableElements = document.querySelectorAll<HTMLTableElement>('article table'); // Select the ordered list
    if (tableElements.length) {
      tableElements.forEach((table) => {
        const divTag = document.createElement('div');
        divTag.classList.add("table-container");
        //table.classList.add("table");
        //table.classList.add("rounded-container-token");
        //table.classList.add("table-hover");
        divTag.append(table.cloneNode(true))
        table.parentNode?.replaceChild(divTag,table)
      })
    }
  }
  
  const numbering =() => {
    const olElements = document.querySelectorAll('ol:not([class])');

    olElements.forEach((ol) => {
      // Check if the ol element already has the 'list' class
      if (!ol.classList.contains('list')) {
        ol.classList.add('list');

        let index = 1;
        ol.querySelectorAll('li').forEach((li) => {
          const spanIndex = document.createElement('span');
          const spanText = document.createElement('span');

          spanIndex.textContent = index + '.';
          spanText.textContent = li.textContent;
          spanText.classList.add('flex-auto');
          spanText.classList.add('text-xs');

          li.setAttribute('data-index', index);
          li.innerHTML = '';
          li.appendChild(spanIndex);
          li.appendChild(spanText);

          index++;
        });
      }
    });
  }
  
  const renderer = new marked.Renderer();
  renderer.code = function (code, language) {
    if (code.match(/^sequenceDiagram/) || code.match(/^graph/) || language == 'mermaid') {
      return '<pre class="mermaid">' + code + '</pre>';
    } else {
      return '<pre><code>' + code + '</code></pre>';
    }
  };
  //renderer.list(string body, boolean ordered, number start){
  renderer.list = function(body, ordered, start){
    if(ordered){
      return `
        <ol class="ordered">
          ${body}
        </ol>
      `;
    }else{
      return `
        <ul class="list un-ordered">
        	${body}
        </ul>
      `;
    }
  }
  //renderer.listitem(string text, boolean task, boolean checked){
  renderer.listitem = function(text, task, checked){
    return `
      	<li>
      		<span class="flex text-xs">
      		  • ${text}
      		</span>
      	</li>
    `;
  }
  marked.use({renderer})
</script>


<div
  class="flex w-full items-center justify-center rounded-md bg-white/5 p-[rfs(50px)] sm:p-5  snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto"
>
  <article class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
    {#key markdown}
      <MermaidDiagram>
        <MathJax math={marked.parse(markdown)}/>
      </MermaidDiagram>
    {/key}
  </article>
</div>



