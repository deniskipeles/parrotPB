<script>
  import { page } from '$app/stores';
  import MdEditor from '$lib/editor/MDEditor.svelte';
</script>

<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb">
    <a class="anchor" href={`/${$page.params?.main_link}/${$page.params?.sub_link}`}
      >{$page.params?.sub_link?.replace('/', '')?.split('-')?.join(' ')?.split('_')?.join(' ')}</a
    >
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">Create Article</li>
</ol>

<MdEditor />
