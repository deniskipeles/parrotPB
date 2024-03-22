<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { afterNavigate } from '$app/navigation';

  export let markdown = '';

  function addClassToAllTags(htmlString: string) {
    // Define a regular expression to match HTML tags except for <code>
    const tagRegex = /<(?!code)([a-zA-Z0-9-]+)([^>]*)>/g;
    // Replace each matched tag with the tag and a class attribute
    const updatedHtmlString = htmlString.replace(tagRegex, '<$1 class="$1"$2>');

    return updatedHtmlString;
  }

  let toBeCalled = true;
  onMount(() => change());
  afterNavigate(() => change());
  // Local
  const toastStore = getToastStore();
  const change = () => {
    //injectNumbering();
    //injectBullets();
    // imgJsInjection()
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
    // ordered list
    /*document.querySelectorAll('ol').forEach((elem) => {
      elem.classList.add('list');
    });*/
    
  };

  // Function to inject bullets into the unordered list
  function injectBullets() {
    const ulElements = document.querySelectorAll('article ul'); // Select all unordered lists
    ulElements.forEach((ul) => {
      if (!ul.classList.contains('list1')) {
        ul.classList.add('list1');
        // Iterate through the list items and add bullets
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
          li.textContent = `• ${li.textContent}`;
        });
      }
    });
  }

  // Function to inject numbering into the ordered list
  function injectNumbering() {
    const olElements = document.querySelectorAll('article ol'); // Select the ordered list
    if (olElements.length) {
      olElements.forEach((ol) => {
        if (!ol.classList.contains('list1')) {
          ol.classList.add('list');
          // Iterate through the list items and add numbering
          const lis = ol.querySelectorAll('li');
          lis.forEach((li, index) => {
            const number = index + 1;
            const span = document.createElement('span');
            span.classList.add('badge');
            span.classList.add('bg-primary-500');
            span.innerText = number + '. ';
            li.prepend(span);
            li.textContent = `${li.textContent}`;
          });
        }
      });
    }
  }

  function imgJsInjection() {
    const olElements = document.querySelectorAll('article img'); // Select the ordered list
    if (olElements.length) {
      olElements.forEach((img) => {
        img.classList.add("w-auto");
        //img.classList.add("rounded-container-token");
        //img.classList.add("shadow-xl");
      })
    }
  }
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
    class="flex w-full max-w-[1280px] flex-1 flex-col gap-5 prose-headings:leading-tight prose-h1:text-50px prose-h2:text-40px prose-h3:text-30px prose-h4:text-25px prose-h5:text-20px prose-h6:text-18px prose-p:text-base prose-p:leading-relaxed prose-p:text-white/50 prose-a:text-base prose-a:text-main prose-a:underline prose-a:underline-offset-4 prose-blockquote:w-fit prose-blockquote:rounded-md prose-blockquote:border-l-2 prose-blockquote:border-l-white/50 prose-blockquote:bg-white/5 prose-blockquote:p-5 prose-strong:text-white prose-code:text-base prose-code:text-white/50 prose-ol:list-inside prose-ol:list-decimal prose-ol:space-y-2 prose-ol:text-base
    prose-ul:list-inside prose-ul:list-disc prose-ul:space-y-2 prose-ul:text-base prose-img:w-auto prose-img:rounded-md fill-white"
  >
    {@html addClassToAllTags(marked.parse(markdown))}
  </article>
</div>

