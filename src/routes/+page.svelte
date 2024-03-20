<script lang="ts">
  export let data: PageData;

  import { page } from '$app/stores';
  import { LayoutPage } from '$lib/components';
  import Error from '$lib/components/Error.svelte';
  import { blogDateFormatter, getPbImageUrl, mdToText, getYouTubeId } from '$lib/utils';
  import type { PageData } from './$types';

  const perPage = $page.url.searchParams.get('perPage') || 30;
</script>

<LayoutPage>
  {#if data?.error}
    <Error error={data?.error} />
  {:else if data?.meta}
    <hr />
    <!-- Blog List -->
    <section class="blog-list space-y-8">
      {#each data?.meta?.items as post}
        <a
          class="block hover:card hover:variant-soft p-4 rounded-container-token"
          href={`${post?.link}/${post.id}`}
          data-sveltekit-preload-data="hover"
        >
          <article class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8">
            <!-- Featured Image -->
            {#if post?.url}
              <div class="w-full md:w-2/3 lg:w-1/2 mx-auto">
                <iframe class="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${getYouTubeId(post?.url)}`}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
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
