<script lang="ts">
  import type { PageData } from './$types';
  const perPage = $page.url.searchParams.get('perPage') || 30;
  const pageNumber = $page.url.searchParams.get('page') || 1;
  
  import Preview from '$lib/editor/Preview.svelte';
  import { onMount } from 'svelte';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { Error, LayoutPage } from '$lib/components';
  export let data: PageData;

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
  <meta name="description" content={getSubText(100, data?.article?.content)} />
  <link rel="apple-touch-icon" sizes="76x76" href={logo} />
  <link rel="icon" type="image/svg+xml" href={logo} />
  <link rel="icon" type="image/png" href={logo} />
  {/if}
</svelte:head>

{#if data?.article}
<!-- Breadcrumbs -->
<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="capitalize">article</li>
</ol>


  <LayoutPage>
    {#if data?.error}
      <Error error={data?.error} />
    {:else if data.article}
      <!-- blog-post -->
      <div class="max-w-5xl mx-auto space-y-8">
        <!-- Header -->
        <header class="space-y-4">
          <!-- Timestamp / Read Time -->
          <div class="blog-meta flex justify-between items-center">
            <time class="time block">Created On: {blogDateFormatter(data?.article?.created)}</time>
            <time class="time block">Updated On: {blogDateFormatter(data?.article?.updated)}</time>
            <span class="hidden md:block text-xs opacity-50"
              >{data?.article?.reading_time ?? 5} min read</span
            >
          </div>
          <h1 class="h1">{data?.article?.title}</h1>
          <!-- Byline -->
          <div class="flex items-center space-x-4 py-4">
            <Avatar
              src={getPbImageUrl(
                data?.article?.expand?.developer_id,
                data?.article?.expand?.developer_id?.avatar,
                undefined
              ) ?? ''}
              alt={data?.article?.expand?.developer_id?.username}
            />
            <div>
              <div class="flex">
                <span class="badge">BY</span>:
                <span class="block"
                  >{data?.article?.expand?.developer_id?.name?.length > 0
                    ? data?.article?.expand?.developer_id?.name
                    : data?.article?.expand?.developer_id?.username}</span
                >
              </div>
              <a
                target="_blank"
                class="anchor text-secondary-500 text-xs"
                href={data?.article?.expand?.developer_id?.website ??
                  `https://twitter.com/KipelesKemboi`}
                >{data?.article?.expand?.developer_id?.username}</a
              >
            </div>
          </div>
          <!-- Featured Image -->
          {#if data?.article.cover_image}<img
              src={getPbImageUrl(data?.article, data?.article.cover_image, '0x0')}
              alt={data?.article.title}
              class="w-full rounded-container-token shadow-xl"
            />{/if}
            {#if data?.article?.url}
            <div class="w-full md:w-2/3 lg:w-1/2 mx-auto">
              <iframe class="w-full aspect-video"
                src={`https://www.youtube.com/embed/${getYouTubeId(data?.article?.url)}`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
            {/if}
        </header>
        <!-- Article -->
        <Preview markdown={data?.article?.content} />
        <!-- Footer -->
        <footer class="card p-4 variant-glass-surface flex justify-between items-center mb-28">
          <!-- Tags -->

          <!-- Scroll to Top -->
          <!-- prettier-ignore -->
          <button class="btn variant-ghost-surface" on:click={()=>{scrollToTop()}}>Scroll to Top &uarr;</button>
        </footer>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>

      <header class="card p-4 m-4 justify-between items-center">
        <div class="space-y-4">
          <h1 class="h1">Reccomendations</h1>
          <p>
            You may be interested in this articles. After reading <strong
              >{data?.article?.title}</strong
            >
          </p>
          <div class="flex items-center space-x-4 overflow-x">
            {#each data?.article?.tags ?? [] as tag}
              <span class="text-sm font-bold opacity-50 capitalize">{tag}</span>
            {/each}
          </div>
        </div>

        {#each data?.recommended ?? [] as post}
          <a
            class="block hover:card hover:variant-soft p-4 rounded-container-token"
            href={`${$page?.url?.origin}?article=${post.id}`}
            data-sveltekit-preload-data="hover"
          >
            <article class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8">
              <!-- Featured Image -->
              {#if post.cover_image}
                <img
                  class="bg-black/50 w-full lg:max-w-sm rounded-container-token shadow-xl bg-cover bg-center"
                  src={getPbImageUrl(post, post.cover_image, '100x100')}
                  alt="thumbnail"
                />
              {/if}
              <!-- Content -->
              <div class="space-y-4">
                <time class="block">{blogDateFormatter(post.updated)}</time>
                <h2 class="h2">{post.title}</h2>
                <!-- <p>{post.excerpt}</p> -->
                <p>{@html post.content}</p>
                <!-- <Preview markdown={post?.content} /> -->
                <div class="flex items-center space-x-4 overflow-x">
                  {#each post.tags as tag}
                    <span class="text-xs font-bold opacity-50 capitalize">{tag}</span>
                  {/each}
                </div>
                <button class="btn variant-ghost-surface">Read Article &rarr;</button>
              </div>
            </article>
          </a>
        {/each}
      </header>
    {/if}
  </LayoutPage>

{:else}

<LayoutPage>
  {#if data?.error}
    <Error error={data?.error} />
  {:else if data?.meta}
    <hr />
    <!-- Blog List -->
    <section class="blog-list space-y-8">
      {#each data?.meta?.items as post}
        <a
          class="block card hover:variant-soft rounded-container-token"
          href={`${$page.url.origin}?article=${post.id}`}
          data-sveltekit-preload-data="hover"
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
              <div class="flex items-center space-x-4">
                {#each post.tags as tag}
                  <span class="text-xs font-bold opacity-50 capitalize">{tag}</span>
                {/each}
              </div>
              <button class="btn variant-ghost-surface">Read Article &rarr;</button>
            </div>
          </article>
        </a>
      {/each}
    </section>
    <hr />
    <!-- Pagination -->
    <footer class="flex justify-between items-center space-x-4">
      <div>
        <small class="opacity-50">Page {data.meta?.page} of {data.meta?.totalPages}</small>
      </div>
      <div class="flex items-center space-x-4">
        <a href={`/?perPage=${perPage}&page=${(data?.meta?.page ?? 1) - 1}`}>
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
            ? `/?perPage=${perPage}&page=${(data?.meta?.page ?? 1) + 1}`
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
</LayoutPage>
{/if}
