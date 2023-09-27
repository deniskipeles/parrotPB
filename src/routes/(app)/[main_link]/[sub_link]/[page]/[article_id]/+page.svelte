<script lang="ts">
  import Preview from '$lib/editor/Preview.svelte';
  import { onMount } from 'svelte';
  //   import DOMPurify from 'dompurify';
  // Components
  import { Avatar } from '@skeletonlabs/skeleton';
  import { Error, LayoutPage } from '$lib/components';

  import type { PageData } from './$types';

  /** @type {import('./$types').PageData} */
  export let data: PageData;

  // Blog Utils
  import { blogDateFormatter } from '../blog-service';
  import { getPbImageUrl } from '$lib/utils';
  import { page } from '$app/stores';

  // Local
  let elemPage: HTMLElement | null;

  onMount(() => {
    // Element Page
    elemPage = document.querySelector('#page');
  });

  function scrollToTop(): void {
    if (elemPage) elemPage.scrollTop = 0;
  }
</script>

<!-- Breadcrumbs -->
<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/blog">home</a></li>
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
          <time class="time block">{blogDateFormatter(data?.article?.updated)}</time>
          <span class="hidden md:block text-xs opacity-50"
            >{data?.article?.reading_time ?? 5} min read</span
          >
        </div>
        <h1 class="h1">{data?.article?.title}</h1>
        <!-- Byline -->
        <div class="flex items-center space-x-4 py-4">
          <Avatar
            src={getPbImageUrl(data?.article?.expand?.developer_id, data?.article?.expand?.developer_id?.avatar, undefined) ?? ''}
            alt={data?.article?.expand?.developer_id?.username}
          />
          <div>
            <span class="block"
              >{data?.article?.expand?.developer_id?.name?.length > 0
                ? data?.article?.expand?.developer_id?.name
                : data?.article?.expand?.developer_id?.username}</span
            >
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
      </header>
      <!-- Article -->
      <Preview markdown={data?.article?.content} />
      <!-- Footer -->
      <footer class="card p-4 variant-glass-surface flex justify-between items-center mb-28">
        <!-- Tags -->
        <div class="flex items-center space-x-4">
          {#each data?.article?.tags ?? [] as tag}
            <span class="text-sm font-bold opacity-50 capitalize">{tag}</span>
          {/each}
        </div>
        <!-- Scroll to Top -->
        <!-- prettier-ignore -->
        <button class="btn variant-ghost-surface" on:click={()=>{scrollToTop()}}>Scroll to Top &uarr;</button>
      </footer>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
  {/if}
</LayoutPage>
