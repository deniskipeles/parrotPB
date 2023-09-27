<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutPage } from '$lib/components';

  const data = {};
</script>

<ol class="breadcrumb">
  <li class="crumb"><a class="anchor" href="/">Home</a></li>
  <li class="crumb-separator" aria-hidden>/</li>
  <li class="crumb capitalize">
    {$page.params?.sub_link?.replace('/', '')?.split('-')?.join(' ')?.split('_')?.join(' ')}
  </li>
</ol>

<LayoutPage>
  <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each new Array(20) as item, key}
      <a href={`/${$page.params?.main_link}/${$page.params?.sub_link}/${key+1}`}>
        <div class="h-auto max-w-full rounded-lg card-hover card items-center text-center">
          <p class="font-medium">page</p>
          <p class="text-8xl font-bold">{key+1}</p>
        </div>
      </a>
    {/each}
  </section>
</LayoutPage>
