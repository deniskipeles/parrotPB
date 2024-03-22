<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { afterNavigate } from '$app/navigation';

  export let markdown = '';

  let toBeCalled = true;
  onMount(() => change());
  afterNavigate(() => change());
  // Local
  
  function injectTailwindClasses(classesObj) {
    // Iterate through the object keys
    for (const [element, classes] of Object.entries(classesObj)) {
      // Get all elements matching the tag name inside <article>
      const elements = document.querySelectorAll('article ' + element);
  
      // Iterate through each element
      for (let i = 0; i < elements.length; i++) {
        // Split the classes string into an array
        const classesArray = classes.split(' ');
  
        // Add each class to the element
        for (const cssClass of classesArray) {
          elements[i].classList.add(cssClass);
        }
      }
    }
  }

  const tailwindClasses = {
    h1: "h1 text-3xl font-bold mb-4",
    h2: "h2 text-2xl font-bold mb-4",
    h3: "h3 text-xl font-bold mb-4",
    h4: "h4 text-lg font-bold mb-4",
    h5: "h5 text-base font-bold mb-4",
    h6: "h6 text-sm font-bold mb-4",
    p: "p block text-gray-700 mb-4",
    a: "a anchor text-blue-500 underline hover:no-underline",
    ul: "ul list-disc pl-6 mb-4",
    ol: "ol list list-decimal pl-6 mb-4",
    li: "li list text-gray-700",
    blockquote: "blockquote text-gray-700 italic border-l-4 border-gray-300 pl-4 mb-4",
    pre: "pre text-gray-700 bg-gray-100 p-4 rounded mb-4",
    code: "code text-gray-700 bg-gray-100 px-1 rounded",
    img: "img w-auto h-auto mb-4",
    table: "table table-hover w-full text-left divide-y divide-gray-300 mb-4",
    th: "th text-gray-700 font-bold bg-gray-100 px-4 py-2",
    td: "td text-gray-700 px-4 py-2",
    strong: "strong font-bold",
    em: "em italic",
    hr: "hr border-gray-300 mb-4",
    button: "button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700",
    input: "input border border-gray-300 rounded py-2 px-4 w-full",
    textarea: "textarea border border-gray-300 rounded py-2 px-4 w-full",
    select: "select border border-gray-300 rounded py-2 px-4 w-full",
    label: "label text-gray-700 font-bold mb-2",
    form: "form",
    fieldset: "fieldset border border-gray-300 rounded px-4 py-2 mb-4",
    legend: "legend text-gray-700 font-bold mb-2",
    iframe: "iframe w-full h-auto mb-4",
    figure: "figure mb-4",
    figcaption: "figcaption text-gray-700 italic mb-4",
    cite: "cite text-gray-700 italic",
    q: "q text-gray-700 italic",
    sup: "sup text-xs font-normal",
    sub: "sub text-xs font-normal",
    small: "small text-xs font-normal",
    mark: "mark bg-yellow-200 text-gray-700 px-1 rounded",
    del: "del line-through text-gray-500",
    ins: "ins underline text-gray-700",
    time: "time text-gray-700",
    abbr: "abbr border-b border-dotted text-gray-700",
    acronym: "acronym border-b border-dotted text-gray-700",
    address: "address text-gray-700",
    caption: "caption text-gray-700 font-bold mb-2",
    code: "code text-gray-700 bg-gray-100 px-1 rounded",
    dd: "dd text-gray-700 mb-2",
    dt: "dt text-gray-700 font-bold mb-2",
    kbd: "kbd text-gray-700 bg-gray-100 px-1 rounded",
    samp: "samp text-gray-700 bg-gray-100 px-1 rounded",
    var: "var text-gray-700 italic",
    // Add more elements and their corresponding Tailwind classes here
  };

  function injectInlineSVGClass() {
    const imgElements = document.querySelectorAll('p img');
  
    for (let i = 0; i < imgElements.length; i++) {
      imgElements[i].classList.add('inline-svg');
    }
  }
  
  

  
  const toastStore = getToastStore();
  const change = () => {
    // Call the function to inject Tailwind classes into the HTML elements
    injectTailwindClasses(tailwindClasses);
    // Call the function to inject the inline-svg class into img elements within p tags
    injectInlineSVGClass();
    
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
      hljs.highlightElement(elem);
    });
  };
  
  


  function tableJsInjection() {
    const tableElements = document.querySelectorAll<HTMLTableElement>('article table'); // Select the ordered list
    if (tableElements.length) {
      tableElements.forEach((table) => {
        const divTag = document.createElement('div');
        divTag.classList.add("table-container");
        table.classList.add("table");
        table.classList.add("rounded-container-token");
        table.classList.add("table-hover");
        divTag.append(table.cloneNode(true))
        table.parentNode?.replaceChild(divTag,table)
      })
    }
  }
</script>

<!-- else content here 
<article class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
-->
<div
  class="flex w-full items-center justify-center rounded-md bg-white/5 p-[rfs(50px)] sm:p-5"
>
  <article
    class="flex w-full max-w-full flex-1 flex-col gap-5 prose-headings:leading-tight prose-h1:text-50px prose-h2:text-40px prose-h3:text-30px prose-h4:text-25px prose-h5:text-20px prose-h6:text-18px prose-p:text-base prose-p:leading-relaxed prose-p:text-white/50 prose-a:text-base prose-a:text-main prose-a:underline prose-a:underline-offset-4 prose-blockquote:w-fit prose-blockquote:rounded-md prose-blockquote:border-l-2 prose-blockquote:border-l-white/50 prose-blockquote:bg-white/5 prose-blockquote:p-5 prose-strong:text-white prose-code:text-base prose-code:text-white/50 prose-ol:list-inside prose-ol:list-decimal prose-ol:space-y-2 prose-ol:text-base
    prose-ul:list-inside prose-ul:list-disc prose-ul:space-y-2 prose-ul:text-base prose-img:w-auto prose-img:rounded-md"
  >
    {@html marked.parse(markdown)}
  </article>
</div>


<style>
  .inline-svg {
    display: inline-block;
    vertical-align: middle;
  }

</style>
