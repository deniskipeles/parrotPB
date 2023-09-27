<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';

  export let markdown = '';

  function addClassToAllTags(htmlString: string) {
    // Define a regular expression to match HTML tags except for <code>
    const tagRegex = /<(?!code)(?!ol)(?!li)([a-zA-Z0-9-]+)([^>]*)>/g;
    // Replace each matched tag with the tag and a class attribute
    const updatedHtmlString = htmlString.replace(tagRegex, '<$1 class="$1"$2>');

    return updatedHtmlString;
  }

  // Local
  onMount(() => {
    // CodeBlock Highlight
    document.querySelectorAll('pre code').forEach((elem: any) => {
      hljs.highlightElement(elem);
    });
    // ordered list
    document.querySelectorAll('ol').forEach((elem: any) => {
      elem.classList.add('list');
    });
    injectNumbering();
    // injectBullets()
  });

  // Function to inject bullets into the unordered list
  function injectBullets() {
    const ulElements = document.querySelectorAll('article ul'); // Select all unordered lists
    ulElements.forEach((ul) => {
      // Iterate through the list items and add bullets
      const lis = ul.querySelectorAll('li');
      lis.forEach((li) => {
        li.textContent = `• ${li.textContent}`;
      });
    });
  }

  // Function to inject numbering into the ordered list
  function injectNumbering() {
    const ol = document.querySelector('article ol'); // Select the ordered list
    if (ol) {
      // Iterate through the list items and add numbering
      const lis = ol.querySelectorAll('li');
      lis.forEach((li, index) => {
        const number = index + 1;
        li.textContent = `${number}. ${li.textContent}`;
      });
    }
  }
</script>

<!-- else content here -->
<article class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
  {@html addClassToAllTags(marked.parse(markdown))}
</article>

<style>
  /* Style the <ol> element */
  ol {
    list-style-type: none; /* Remove default numbering */
    counter-reset: my-counter; /* Initialize a custom counter */
  }

  /* Style the <li> elements within the <ol> */
  ol li::before {
    content: counter(my-counter); /* Display the custom counter content */
    counter-increment: my-counter; /* Increment the custom counter */
    margin-right: 0.5em; /* Add spacing between the counter and content */
  }

  /* Style the <ul> element */
  ul {
    list-style-type: none; /* Remove default bullets */
  }

  /* Style the <li> elements within the <ul> */
  ul li::before {
    content: '\2022'; /* Use a bullet character (•) as a marker */
    /*color: #ff0000; /* Change the marker color to red (you can customize this) */
    font-size: 1.2em; /* Adjust the marker size */
    margin-right: 0.5em; /* Add spacing between the marker and content */
  }
</style>
