<script>
  import { page } from '$app/stores';
  import { getLabelById } from '$lib/utils';

  // import Editor from "$lib/editor/Editor.svelte";
  import MdEditor from '$lib/editor/MDEditor.svelte';
</script>

<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb">
    <a class="anchor" href={`/${$page.params?.main_link}`}
      >{getLabelById($page.data?.links,$page.params?.main_link)}</a
    >
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb">
    <a class="anchor" href={`/${$page.params?.main_link}/${$page.params?.sub_link}`}
      >{getLabelById($page.data?.links,$page.params?.sub_link)}</a
    >
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">
    {getLabelById($page.data?.links,$page.params?.sub_menu_list_id)}
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">Create Article</li>
</ol>

<MdEditor />
