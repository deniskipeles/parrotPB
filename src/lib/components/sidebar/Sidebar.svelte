<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';

  import { AppRail, AppRailTile, InputChip, ProgressRadial, popup } from '@skeletonlabs/skeleton';
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import type { SubmitFunction } from '@sveltejs/kit';

  // Local
  // let currentRailCategory: keyof typeof menuNavLinks | undefined = undefined;
  let currentRailCategory: string | undefined = undefined;
  const drawerStore = getDrawerStore();

  // Lifecycle
  page.subscribe((page_) => {
    // ex: /basePath/...
    if (page_.url.pathname == '/') currentRailCategory = '/';
    let basePath: string = page_.url.pathname.split('/')[1];
    if (!basePath) return;

    for (const key in $page.data?.links ?? []) {
      let k = key;
      if ([key?.split('/').join('') + ''].includes(basePath)) {
        currentRailCategory = k;
      }
    }
  });

  // Reactive
  $: submenu = $page?.data?.links[currentRailCategory ?? '/'];
  // $: listboxItemActive = (href: string) => (`/${$page.params?.main_link}/${$page.params?.sub_link}`) ? 'bg-primary-active-token' : '';
  $: listboxItemActive = (href: string) =>
    $page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';

  function getIcon(value: any) {
    if (value?.length > 0) {
      if (value[0]?.icon_font_awesome.length > 0) {
        return value[0]?.icon_font_awesome;
      }
    }
    return 'fa fa-cogs';
  }

  let loading_links = false;
  let error: any = null;
  const createSublinks: SubmitFunction = async ({ formData }) => {
    let href = (await formData.get('label')) as string;
    href = await href.trim().split('/').join('-').split(' ').join('-').toLowerCase();
    await formData.append('href', `/${href}`);
    loading_links = true;
    return async ({ result, formData }) => {
      const link = formData.get('parent_link_value') as string;

      await applyAction(result);
      loading_links = false;
      if ($page.form?.error) {
        error = $page.form?.error;
      } else {
        invalidateAll();
        currentRailCategory = link;
        console.log(link);
      }
    };
  };

  let loading = false;
  const createLinks: SubmitFunction = async ({ formData }) => {
    loading = true;
    // let link = (await formData.get('link')) as string;
    // link = await link.trim().split('/').join('-').split(' ').join('-').toLowerCase();
    // await formData.append('link', `/${link}`);

    return async ({ result, formData }) => {
      await formData.get('link');
      await applyAction(result);
      invalidateAll();
      loading = false;
    };
  };

  let list = ['svelte', 'sveltekit', 'nodejs'];
  let link_ = '';
  function inputLink() {
    link_ = link_?.replace('/', '');
    link_ = `/${link_.trimStart().split('/').join('-').split(' ').join('-').toLowerCase()}`;
  }
</script>

<div
  class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {currentRailCategory ==
  '/'
    ? ''
    : $$props.class ?? ''}"
>
  <!-- App Rail -->
  <AppRail background="bg-transparent" border="border-r border-surface-500/30">
    <!-- Mobile Only -->
    <AppRailTile
      bind:group={currentRailCategory}
      name="/"
      on:click={() => goto('/', { replaceState: false })}
      value={'/'}
    >
      <svelte:fragment slot="lead"
        ><i class={`fa fa-home text-2xl`} aria-hidden="true" /></svelte:fragment
      >
      <span class="capitalize">Home</span>
    </AppRailTile>
    {#each $page.data?.links ?? [] as record}
      <AppRailTile bind:group={currentRailCategory} name={record?.id} value={record?.label}>
        <svelte:fragment slot="lead"
          ><i class={`fa ${record?.icon_font_awesome ?? getIcon(record)} text-2xl`} aria-hidden="true" /></svelte:fragment
        >
        <span class="capitalize">{record?.label}</span>
      </AppRailTile>
      <hr class="opacity-30" />
    {/each}
    <AppRailTile bind:group={currentRailCategory} name="add" value={'add'}>
      <svelte:fragment slot="lead"
        ><i class={`fa fa-plus text-2xl`} aria-hidden="true" /></svelte:fragment
      >
      <span class="capitalize">add</span>
    </AppRailTile>
  </AppRail>
  <!-- Nav Links -->
  <section class="p-4 pb-20 space-y-4 overflow-y-auto">
    {#if currentRailCategory == 'add'}
      <form
        action="/?/createLinks"
        method="POST"
        use:enhance={createLinks}
        class="card p-4 w-60 shadow-xl"
      >
        <nav class="list-nav">
          <div>
            <div>
              <label class="label">
                <span>Title</span>
                <input class="input pl-2" name="title" type="text" placeholder="Docs" />
              </label>
            </div>
            <div>
              <label class="label">
                <span>Link</span>
                <input
                  class="input pl-2"
                  bind:value={link_}
                  on:input={inputLink}
                  name="link"
                  type="text"
                  placeholder="/docs"
                />
              </label>
            </div>
            <div>
              <label class="label">
                <span>Font Awesome</span>
                <input
                  class="input pl-2"
                  name="icon_font_awesome"
                  value="fa fa-plus"
                  type="text"
                  placeholder="fa fa-home"
                />
              </label>
            </div>
            <div>
              <label class="label">
                <span>Description</span>
                <textarea
                  class="textarea p-2"
                  name="description"
                  rows="4"
                  placeholder="Super short description about my page category."
                />
              </label>
            </div>
            <hr class="!my-4" />
            <div class="p-4 space-y-2 items-center">
              {#if loading}
                <!-- content here -->
                <ProgressRadial stroke={100} width="w-10" />
              {:else}
                <!-- else content here -->
                <button class="variant-filled-secondary">
                  <i class={`fa fa-plus text-2xl`} aria-hidden="true" /> Add Category
                </button>
              {/if}
            </div>
          </div>
        </nav>
        <!-- <div class="arrow bg-surface-100-800-token" /> -->
      </form>
    {:else}
      {#each submenu ?? [] as segment, i}
        <!-- Title -->
        <p class="font-bold pl-4 text-2xl">{segment.title}</p>
        <div class="">
          <!-- trigger -->
          <button
            class="btn hover:variant-soft-primary"
            use:popup={{
              event: 'click',
              target: `formAddLinks-${segment.id}`,
              closeQuery: `a[href]-${i}`
            }}
          >
            <i class="fa fa-plus text-lg md:!hidden" />
            <span class="hidden md:inline-block">ADD CATEGORY</span>
            <i class="fa-solid fa-caret-down opacity-50" />
          </button>
          <!-- popup -->
          <div data-popup={`formAddLinks-${segment.id}`}>
            <form
              action="/?/createSublinks"
              method="POST"
              use:enhance={createSublinks}
              class="card p-4 w-60 shadow-xl z-10"
            >
              <nav class="list-nav">
                <input type="hidden" name="parent_link" value={segment?.id} />
                <input type="hidden" name="parent_link_value" value={segment?.link} />
                <ul>
                  <li>
                    <label class="label">
                      <span>Label</span>
                      <input class="input pl-2" name="label" type="text" placeholder="My Link" />
                    </label>
                  </li>
                  <!-- <li>
                    <label class="label">
                      <span>Link</span>
                      <input class="input pl-2" name="href" type="text" placeholder="/my-link" />
                    </label>
                  </li> -->
                  <li>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">
                      <span>Keywords</span>
                      <InputChip
                        bind:value={list}
                        name="keywords"
                        placeholder="Enter any value..."
                      />
                    </label>
                  </li>
                  <hr class="!my-4" />
                  <li class="p-4 space-y-2 items-center">
                    {#if loading_links}
                      <!-- content here -->
                      <ProgressRadial stroke={100} width="w-10" />
                    {:else}
                      <!-- else content here -->
                      <button class="variant-filled-secondary">
                        <i class={`fa fa-plus text-2xl`} aria-hidden="true" /> ADD Category
                      </button>
                    {/if}
                  </li>
                </ul>
              </nav>
              <!-- <div class="arrow bg-surface-100-800-token" /> -->
            </form>
          </div>
        </div>
        <!-- Nav List -->
        <nav class="list-nav">
          <ul>
            {#each segment.list ?? [] as { href, label, badge }}
              <li on:keypress on:click={drawerStore.close}>
                <a
                  href={segment?.link + href}
                  class={listboxItemActive(segment?.link + href + '/')}
                  data-sveltekit-preload-data="hover"
                >
                  <span class="flex-auto">{@html label}</span>
                  {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        <!-- Divider -->
        {#if i + 1 < submenu.length}<hr class="!my-6 opacity-50" />{/if}
      {/each}
    {/if}
  </section>
</div>
