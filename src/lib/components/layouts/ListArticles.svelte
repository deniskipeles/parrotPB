<script lang="ts">
  
  const perPage = $page.url.searchParams.get('perPage') || 30;
  const pageNumber = $page.url.searchParams.get('page') || 1;
  
  import Preview from '$lib/editor/Preview.svelte';
  import ViewArticle from '$lib/components/layouts/ViewArticle.svelte';
  import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
  
  import { onMount } from 'svelte';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { Error, LayoutPage } from '$lib/components';
  export let data;

  // Blog Utils
  import {
    blogDateFormatter,
    getPbImageUrl,
    getSubText,
    mdToText,
    getYouTubeId
  } from '$lib/utils';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  
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
</script>




<svelte:head>
  {#if data?.article}
  <title>{data?.article?.title}</title>
  <meta name="description" content={data?.article?.excerpt ?? getSubText(100, data?.article?.content??'none')} />
  <link rel="apple-touch-icon" sizes="76x76" href={logo} />
  <link rel="icon" type="image/svg+xml" href={logo} />
  <link rel="icon" type="image/png" href={logo} />
  {/if}
</svelte:head>

<Breadcrumbs/>
<LayoutPage>
{#if data?.article}
  <ViewArticle {data} />
{:else}

  {#if data?.error}
    <Error error={data?.error} />
  {:else if data?.meta}
    <hr />
    <!-- Blog List -->
    <section class="blog-list space-y-8">
      {#if $page.params?.sub_menu_list_id && $page.data?.user}
        <a
          href={`${$page.url.pathname}/create-article`}
          >
          <button type="button" class="btn mr-4 mt-4 mb-4 w-full variant-filled">Create Article</button>
        </a>
      {/if}
      {#each data?.meta?.items ?? [] as post}
        <div
          class="block hover:card variant-soft p-4 rounded-container-token"
        >
          <article class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8">
            <!-- Featured Image -->
            {#if post?.url}
              <img
                class="bg-black/50 w-full lg:max-w-sm rounded-container-token shadow-xl bg-cover bg-center"
                src="/Youtube_logo.png"
                alt="thumbnail"
              />
            {:else if post.cover_image}
              <img
                class="bg-black/50 w-full lg:max-w-sm rounded-container-token shadow-xl bg-cover bg-center"
                src={getPbImageUrl(post, post.cover_image, '720x480')}
                alt="thumbnail"
              />
            {/if}
            
            <!-- Content -->
            <div class="space-y-4">
              <time class="block">{blogDateFormatter(post.updated)}</time>
              <h2 class="h2">{post.title}</h2>
              <!-- <p>{mdToText(post.content)}</p> -->
              <p>{@html post.content}</p>
              <div class="flex items-center space-x-4 overflow-auto">
                {#each post.tags as tag}
                  <span class="text-xs font-bold opacity-50 capitalize">{tag}</span>
                {/each}
              </div>
              <a
                href={`${$page.url.pathname}?article=${post.id}`}
                data-sveltekit-preload-data="hover"
              >
                <button class="btn variant-ghost-surface">Read Article &rarr;</button>
              </a>
            </div>
          </article>
        </div>
      {/each}
    </section>
    <hr />
    <!-- Pagination -->
    <footer class="flex justify-between items-center space-x-4">
      <div>
        <small class="opacity-50">Page {data.meta?.page} of {data.meta?.totalPages}</small>
      </div>
      <div class="flex items-center space-x-4">
        <a href={`${$page.url.pathname}?perPage=${perPage}&page=${(data?.meta?.page ?? 1) - 1}`}>
          <button
            class="btn variant-filled"
            disabled={1 == Number(data?.meta?.page ?? 1) || data.meta.page == 0}
          >
            &larr; Prev
          </button>
        </a>

        <a
          href={!(
            data.meta?.totalPages == Number(data?.meta?.page ?? 1) || data.meta.totalPages == 0
          )
            ? `${$page.url.pathname}?perPage=${perPage}&page=${(data?.meta?.page ?? 1) + 1}`
            : '#'}
        >
          <button
            class="btn variant-filled"
            disabled={data.meta?.totalPages == data?.meta?.page || data.meta.totalPages == 0}
          >
            Next &rarr;
          </button>
        </a>
      </div>
    </footer>
  {/if}
{/if}
</LayoutPage>
