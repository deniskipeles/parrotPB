<script lang="ts">
  import Preview from '$lib/editor/Preview.svelte';
  import EditButton from '$lib/editor/EditButton.svelte';
  import ListArticles from '$lib/components/layouts/ListArticles.svelte';
  
  import { onMount } from 'svelte';
  import { Avatar, SlideToggle } from '@skeletonlabs/skeleton';
  import { Error, LayoutPage } from '$lib/components';
  // import type { PageData } from './$types';
  /** @type {import('./$types').PageData} */
  export let data: PageData;

  // Blog Utils
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
  import { afterNavigate, invalidateAll } from '$app/navigation';
  import { pb } from '$lib/pocketbase';
  // Local
  let elemPage: HTMLElement | null;

  onMount(() => {
    // Element Page
    elemPage = document.querySelector('#page');
  });
  afterNavigate(() => scrollToTop());

  function scrollToTop(): void {
    if (elemPage) elemPage.scrollTop = 0;
  }

  $: logo = getPbImageUrl(data?.article, data?.article ? data?.article.cover_image : null, '100x100');
  $: edit = false;

  async function updateArticle() {
    if (data.article) {
      try {
        const { id, collectionId, collectionName, created, updated, expand, ...article } =
          data.article;
        const formData = setObjectFormData(article);
        await pb.collection(collectionId).update(id, article);
        edit = false;
        invalidateAll();
      } catch (error) {
        console.warn(error);
      }
    }
  }
  
  function markdownChange(val){
    data.article.content = val;
  }
  const editFxn = () => edit = !edit;

</script>



{#if $page.data?.user?.id === data.article?.developer_id}
  <EditButton 
    {data}
    {edit}
    {editFxn}
    {markdownChange}
    {updateArticle}
  />
  {#if edit && data.article}
    <label class="label">
      <span>Article Content :: Markdown Editor</span>
      <div class="flex">
        <div class="w-full h-96">
          <!-- Declare a textarea where the user can enter markdown, and bind it to the variable `markdown` -->
          <textarea
            name="content"
            class="textarea h-auto min-h-full w-full p-2"
            bind:value={data.article.content}
            placeholder="Enter markdown here"
          />
        </div>
      </div>
    </label>
  {/if}
{/if}
{#if !edit}
  <ListArticles {data}/>
{/if}