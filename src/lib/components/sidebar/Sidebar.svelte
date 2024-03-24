<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll, afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  import {
    AppRail,
    AppRailTile,
    InputChip,
    ProgressRadial,
    popup,
  } from '@skeletonlabs/skeleton';
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import type { SubmitFunction } from '@sveltejs/kit';
  
  

  let currentRailCategory: string | undefined = undefined;
  const drawerStore = getDrawerStore();
  
  afterNavigate(()=>{
    drawerStore.close()
  })

  page.subscribe(($page) => {
    if ($page.url.pathname === '/') currentRailCategory = '/';

    let basePath: string = $page.url.pathname;
    if (!basePath) return;

    for (const key in $page.data?.links ?? []) {
      let k = key;
      if (basePath?.includes(key?.id)) {
        currentRailCategory = k?.id;
      }
    }
  });

  $: mainMenu = $page?.data?.links?.find((l) => currentRailCategory == l?.id);

  $: listboxItemActive = (href: string) =>
    $page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';

  let loading_links = false;
  let error: any = null;
  const createSublinks: SubmitFunction = async ({ formData }) => {
    return async ({ result, formData }) => {
    };
  };

  let loading = false;
  const createLinks: SubmitFunction = async ({ formData }) => {
    loading = true;
    loading_links = true;
    return async ({ result, formData }) => {
      await applyAction(result);
      invalidateAll();
      loading = false;
      loading_links = false;
    };
  };

  let list = ['svelte', 'sveltekit', 'nodejs'];
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
      <AppRailTile bind:group={currentRailCategory} name={record?.id} value={record?.id}>
        <svelte:fragment slot="lead"
          ><i class={`fa ${record?.icon_font_awesome?.includes("fa-") ? record?.icon_font_awesome  : ""+record?.icon_font_awesome } text-2xl`} aria-hidden="true" /></svelte:fragment
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
  {#if currentRailCategory !== '/'}
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
            <input type="hidden" name="table" value={"main_menu"} />
            <div>
              <label class="label">
                <span>Label</span>
                <input class="input pl-2" name="label" type="text" placeholder="Docs" />
              </label>
            </div>
            <div>
              <label class="label">
                <span>Font Awesome icon</span>
                <input
                  class="input pl-2"
                  name="icon_font_awesome"
                  value="fa-plus"
                  type="text"
                  placeholder="fa-home"
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
                  placeholder="Super short description about..."
                />
              </label>
            </div>
            <hr class="!my-4" />
            <div class="p-4 space-y-2 items-center">
              {#if loading}
                <ProgressRadial stroke={100} width="w-10" />
              {:else}
                <button class="variant-filled-secondary">
                  <i class={`fa fa-plus text-xl`} aria-hidden="true" /> Save Main Menu
                </button>
              {/if}
            </div>
          </div>
        </nav>
        <!-- <div class="arrow bg-surface-100-800-token" /> -->
      </form>
    {:else}
    
      <div class="">
        <button
          class="btn hover:variant-soft-primary"
          use:popup={{
            event: 'click',
            target: `formLinks-${mainMenu?.id}`,
            closeQuery: `a[href]-${mainMenu?.id}`
          }}
        >
          <i class="fa fa-plus text-xs md:!hidden" />
          <i class="fa fa-plus text-xs md:!hidden" />
          <span class="hidden md:inline-block text-xs">ADD Sub Menu</span>
          <i class="fa-solid fa-caret-down opacity-50 text-xs" />
        </button>
        <div data-popup={`formLinks-${mainMenu?.id}`}>
          <form
            action="/?/createLinks"
            method="POST"
            use:enhance={createLinks}
            class="card p-4 w-60 shadow-xl z-10"
          >
            <nav class="list-nav">
              <input type="hidden" name="main_menu_id" value={mainMenu?.id} />
              <input type="hidden" name="table" value="sub_menu" />
              <ul>
                <li>
                  <label class="label">
                    <span>Label</span>
                    <input class="input pl-2" name="label" type="text" placeholder="KE news" />
                  </label>
                </li>
                <li>
                  <label class="label">
                    <span>Description</span>
                    <textarea
                      class="textarea p-2"
                      name="description"
                      rows="4"
                      placeholder="Super short description about..."
                    />
                  </label>
                </li>
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
                    <button class="variant-filled-secondary">
                      <i class={`fa fa-plus text-lg`} aria-hidden="true" /> Save Sub Menu
                    </button>
                  {/if}
                </li>
              </ul>
            </nav>
          </form>
        </div>
      </div>

      {#each mainMenu?.expand?.sub_menu_via_main_menu_id ?? [] as subMenu, i}
        <!-- Title -->
        <p class="font-bold pl-4 text-xl">{subMenu?.label}</p>
        <div class="">
          <!-- trigger -->
          <button
            class="btn hover:variant-soft-primary"
            use:popup={{
              event: 'click',
              target: `formAddLinks-${subMenu?.id}`,
              closeQuery: `a[href]-${i}`
            }}
          >
            <i class="fa fa-plus text-xs md:!hidden" />
            <i class="fa fa-plus text-xs md:!hidden" />
            <i class="fa fa-plus text-xs md:!hidden" />
            <span class="hidden md:inline-block text-xs">ADD Sub Menu List</span>
            <i class="fa-solid fa-caret-down opacity-50 text-xs" />
          </button>
          <!-- popup -->
          <div data-popup={`formAddLinks-${subMenu.id}`}>
            <form
              action="/?/createLinks"
              method="POST"
              use:enhance={createLinks}
              class="card p-4 w-60 shadow-xl z-10"
            >
              <nav class="list-nav">
                <input type="hidden" name="table" value={`sub_menu_list`} />
                <input type="hidden" name="sub_menu_id" value={subMenu?.id} />
                <ul>
                  <li>
                    <label class="label">
                      <span>Label</span>
                      <input class="input pl-2" name="label" type="text" placeholder="KE news" />
                    </label>
                  </li>
                  <li>
                    <label class="label">
                      <span>Description</span>
                      <textarea
                        class="textarea p-2"
                        name="description"
                        rows="4"
                        placeholder="Super short description about..."
                      />
                    </label>
                  </li>
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
                        <i class={`fa fa-plus text-lg`} aria-hidden="true" /> Save Sub Menu List
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
            {#each subMenu?.expand?.sub_menu_list_via_sub_menu_id ?? [] as { id, label, description }}
              <li on:keypress on:click={drawerStore.close}>
                <a
                  href={`/${mainMenu?.id}/${subMenu?.id}/${id}`}
                  class={listboxItemActive(`/${mainMenu?.id}/${subMenu?.id}/${id}`)}
                  data-sveltekit-preload-data="hover"
                >
                  <span class="flex-auto">{@html label}</span>
                  {#if description}<span class="badge variant-filled-secondary">{description}</span>{/if}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        <!-- Divider -->
        {#if i + 1 < mainMenu?.expand?.sub_menu_via_main_menu_id?.length}<hr class="!my-6 opacity-50" />{/if}
      {/each}
    {/if}
  </section>
  {/if}
</div>
