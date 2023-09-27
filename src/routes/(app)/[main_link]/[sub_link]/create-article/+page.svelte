<script>
  import { page } from '$app/stores';

  // import Editor from "$lib/editor/Editor.svelte";
  import MdEditor from '$lib/editor/MDEditor.svelte';
</script>

<ol class="breadcrumb">
  <li class="crumb"><a class="anchor" href="/">Home</a></li>
  <li class="crumb-separator" aria-hidden>/</li>
  <li class="crumb capitalize">
    <a class="anchor" href={`/${$page.params?.main_link}/${$page.params?.sub_link}`}
      >{$page.params?.sub_link?.replace('/', '')?.split('-')?.join(' ')?.split('_')?.join(' ')}</a
    >
  </li>
  <li class="crumb-separator" aria-hidden>/</li>
  <li class="crumb capitalize">Create Article</li>
</ol>

<MdEditor />
