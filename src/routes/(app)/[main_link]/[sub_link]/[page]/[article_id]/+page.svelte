<script lang="ts">
  import Preview from '$lib/editor/Preview.svelte';
  import { onMount } from 'svelte';
  //   import DOMPurify from 'dompurify';
  // Components
  import { Avatar, SlideToggle } from '@skeletonlabs/skeleton';
  import { Error, LayoutPage } from '$lib/components';

  import type { PageData } from './$types';

  /** @type {import('./$types').PageData} */
  export let data: PageData;

  // Blog Utils
  import {
    blogDateFormatter,
    getPbImageUrl,
    getSubText,
    mdToText,
    setObjectFormData
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
function getYouTubeId(url) {
    const regex = /https:\/\/(m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[2] : null;
  }
</script>

<svelte:head>
  <title>{data?.article?.title}</title>
  <meta name="description" content={getSubText(100, data?.article?.content)} />
  <link rel="apple-touch-icon" sizes="76x76" href={logo} />
  <link rel="icon" type="image/svg+xml" href={logo} />
  <link rel="icon" type="image/png" href={logo} />
</svelte:head>

<!-- Breadcrumbs -->
<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">
    <a class="anchor" href={`/${$page.params?.main_link}/${$page.params?.sub_link}`}
      >{$page.params?.sub_link?.replace('/', '')?.split('-')?.join(' ')?.split('_')?.join(' ')}</a
    >
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">
    <a
      class="anchor"
      href={`/${$page.params?.main_link}/${$page.params?.sub_link}/${$page.params?.page}`}
    >
      Page {$page.params?.page}
    </a>
  </li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="capitalize">article</li>
</ol>

{#if $page.data?.user?.id === data.article?.developer_id}
  <div class="flex gap-4">
    <SlideToggle name="slider-label" on:change={() => (edit = !edit)} checked={edit}
      >Edit The Article</SlideToggle
    >
    <button on:click={async () => await updateArticle()} type="button" class="btn variant-filled"
      >Update Article</button
    >
  </div>
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
  <LayoutPage>
    {#if data?.error}
      <Error error={data?.error} />
    {:else if data.article}
      <!-- blog-post -->
      <div class="max-w-5xl mx-auto p-4 md:p-12 space-y-8">
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
          <div class="flex items-center space-x-4">
            {#each data?.article?.tags ?? [] as tag}
              <span class="text-sm font-bold opacity-50 capitalize">{tag}</span>
            {/each}
          </div>
        </div>

        {#each data?.recommended ?? [] as post}
          <a
            class="block hover:card hover:variant-soft p-4 rounded-container-token"
            href={`${post?.link}/${post.id}`}
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
      </header>
    {/if}
  </LayoutPage>
{/if}
