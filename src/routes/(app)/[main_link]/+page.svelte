<script lang="ts">
  // +page.ts
  import type { PageData } from '../[page]/$types';
  export let data: PageData;

  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  const toastStore = getToastStore();

  // Blog Utils
  import { page } from '$app/stores';
  import { LayoutPage } from '$lib/components';
  import { goto } from '$app/navigation';
  import Error from '$lib/components/Error.svelte';
  import { blogDateFormatter, getPbImageUrl, getSubText, mdToText, setSearchParams, getYouTubeId, getLabelById } from '$lib/utils';

  const perPage = $page.url.searchParams.get('perPage') ?? 30;
  // function onPrevPage(): void {
  let pageNumber = $page.url.searchParams.get('page') ?? 1
  //   goto(``);
  // }
  // function onNextPage(): void {
  //   goto();
  // }

  function copyRSSToClipboard(): void {
    navigator.clipboard.writeText('https://www.skeleton.dev/blog/rss/');
    const t: ToastSettings = { message: 'RSS feed copied to clipboard.' };
    toastStore.trigger(t);
  }
  function gotoCreateArticle() {
    goto(`/${$page.params?.main_link}/${$page.params?.sub_link}/${$page.params?.sub_menu_list_id}/create-article`, {
      replaceState: false
    });
  }

  $: article = data?.meta?.items.length ? data.meta.items[0] : null;
  $: logo = getPbImageUrl(article, article?.cover_image, '100x100') ?? '';
</script>

<svelte:head>
  <title>{getSubText(50,data?._page?.title)}</title>
  <meta name="description" content={getSubText(100,data._page?.description)} />
  <link rel="apple-touch-icon" sizes="76x76" href={logo} />
  <link rel="icon" type="image/svg+xml" href={logo} />
  <link rel="icon" type="image/png" href={logo} />
</svelte:head>

<ol class="breadcrumb m-4 capitalize">
  <li class="crumb"><a class="anchor" href="/">home</a></li>
  <li class="crumb-separator" aria-hidden>&rsaquo;</li>
  <li class="crumb capitalize">
    {getLabelById($page.data?.links,$page.params?.main_link)}
  </li>
</ol>

<LayoutPage>
  {#if data?.error}
    <Error error={data?.error} />
  {:else if data?.meta}
    <!-- else content here -->
    <div class="page-container-wide page-padding">
      <hr />
      <!-- Blog List -->
      <section class="blog-list space-y-8">
        {#each data?.meta?.items as post}
          <a
            class="block hover:card hover:variant-soft p-4 rounded-container-token"
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
          <a
            href={`/${$page.params?.main_link}?page=${
              (data?.meta?.page ?? 1) - 1
            }&perPage=${perPage}`}
          >
            <button
              class="btn variant-filled"
              disabled={1 == Number(data?.meta?.page ?? 1) || data.meta.page == 0}
            >
              &larr; Prev
            </button>
          </a>

          <a
            href={!(
              data.meta?.totalPages == Number(pageNumber ?? 1) || data.meta.totalPages == 0
            )
              ? `/${$page.params?.main_link}?page=${
                  (data?.meta?.page ?? 1) + 1
                }&perPage=${perPage}`
              : '#'}
          >
            <button
              class="btn variant-filled"
              disabled={data.meta?.totalPages ==
                Number(pageNumber ?? data?.meta?.page ?? 1) || data.meta.totalPages == 0}
            >
              Next &rarr;
            </button>
          </a>
        </div>
      </footer>
    </div>
  {/if}
</LayoutPage>
