<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutPage } from '$lib/components';
  import hljs from 'highlight.js';
  import { onMount } from 'svelte';

  onMount(() => {
    document.querySelectorAll<HTMLPreElement>('pre code').forEach((elem, index) => {
      hljs.highlightElement(elem);
    });
  });
</script>

<LayoutPage>
  <div class="md prose lg:prose-xl max-w-full space-y-4 mb-2">
    <pre>
            <code
        >{JSON.stringify(
          typeof $page.data?.user === 'object' ? $page.data?.user : 'Please login',
          null,
          2
        )}
            </code>
        </pre>
  </div>
</LayoutPage>
