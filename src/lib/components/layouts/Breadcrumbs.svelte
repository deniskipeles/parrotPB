<script>
  import {
    blogDateFormatter,
    getPbImageUrl,
    getSubText,
    mdToText,
    setObjectFormData,
    getYouTubeId,
    getLabelById
  } from '$lib/utils';
  import { page } from '$app/stores';
</script>


<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  {#if $page.params?.main_link}
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb">
    <a class="anchor" href={`/${$page.params?.main_link}`}
      >{getLabelById($page.data?.links,$page.params?.main_link)}</a
    >
  </li>
  {/if}
  {#if $page.params?.sub_link}
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb">
    <a class="anchor" href={`/${$page.params?.main_link}/${$page.params?.sub_link}`}
      >{getLabelById($page.data?.links,$page.params?.sub_link)}</a
    >
  </li>
  {/if}
  {#if $page.params?.sub_menu_list_id}
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">
    <a
      class="anchor"
      href={`/${$page.params?.main_link}/${$page.params?.sub_link}/${$page.params?.sub_menu_list_id}`}
    >
      {getLabelById($page.data?.links,$page.params?.sub_menu_list_id)}
    </a>
  </li>
  {/if}
  {#if $page.params?.article_id || $page.url.searchParams.get('article')} 
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">Article</li>
    {/if}
</ol>

