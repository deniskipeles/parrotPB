<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { afterNavigate } from '$app/navigation';

  export let markdown = '';

  function addClassToAllTags(htmlString: string) {
    // Define a regular expression to match HTML tags except for <code>
    const tagRegex = /<(?!code)(?!ol)(?!li)([a-zA-Z0-9-]+)([^>]*)>/g;
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
    document.querySelectorAll('ol').forEach((elem) => {
      elem.classList.add('list');
    });
    injectNumbering();
    // injectBullets();
    imgJsInjection()
  };

  // Function to inject bullets into the unordered list
  function injectBullets() {
    const ulElements = document.querySelectorAll('article ul'); // Select all unordered lists
    ulElements.forEach((ul) => {
      if (!ul.classList.contains('list')) {
        ul.classList.add('list');
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
        if (!ol.classList.contains('list')) {
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
        img.classList.add("rounded-container-token");
        img.classList.add("shadow-xl");
      })
    }
  }
</script>

<!-- else content here -->
<article class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
  {@html addClassToAllTags(marked.parse(markdown))}
</article>
