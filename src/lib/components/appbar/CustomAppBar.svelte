<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';

  // Types
  import type { ModalSettings, DrawerSettings } from '@skeletonlabs/skeleton';
  import type { SubmitFunction } from '@sveltejs/kit';

  // Docs
  import LogoFull from '$lib/components/icons/LogoFull.svelte';
  import ButtonIcon from '$lib/components/icons/ButtonIcon.svelte';

  // Components & Utilities
  import { AppBar, LightSwitch, popup, getModalStore } from '@skeletonlabs/skeleton';

  // Stores
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import { storeTheme } from '$lib/stores';
  import { page } from '$app/stores';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  const drawerStore = getDrawerStore();

  // Local
  let isOsMac = false;
  const modalStore = getModalStore();

  // Set Search Keyboard Shortcut
  if (browser) {
    let os = navigator.userAgent;
    isOsMac = os.search('Mac') !== -1;
  }

  // Drawer Handler
  function drawerOpen(): void {
    const s: DrawerSettings = { id: 'doc-sidenav' };
    drawerStore.open(s);
  }

  // Search
  function triggerSearch(): void {
    const modal: ModalSettings = {
      type: 'component',
      component: 'modalSearch',
      position: 'item-start'
    };
    modalStore.trigger(modal);
  }

  // Keyboard Shortcut (CTRL/⌘+K) to Focus Search
  function onWindowKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      // Prevent default browser behavior of focusing URL bar
      e.preventDefault();
      // If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
      $modalStore.length ? modalStore.close() : triggerSearch();
    }
  }

  const themes = [
    { type: 'skeleton', name: 'Skeleton', icon: '💀' },
    { type: 'wintry', name: 'Wintry', icon: '🌨️', badge: 'New' },
    { type: 'modern', name: 'Modern', icon: '🤖' },
    { type: 'rocket', name: 'Rocket', icon: '🚀' },
    { type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
    { type: 'vintage', name: 'Vintage', icon: '📺' },
    { type: 'sahara', name: 'Sahara', icon: '🏜️' },
    { type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
    { type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
    { type: 'crimson', name: 'Crimson', icon: '⭕' }
    // { type: 'seasonal', name: 'Seasonal', icon: '🎆' }
    // { type: 'test', name: 'Test', icon: '🚧' },
  ];

  const setTheme: SubmitFunction = ({ formData }) => {
    const theme = formData.get('theme')?.toString();

    if (theme) {
      document.body.setAttribute('data-theme', theme);
      $storeTheme = theme;
    }
  };
  // console.log($page.data.links)
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />

<!-- svelte-ignore a11y-missing-attribute -->
<AppBar shadow="shadow-2xl" slotTrail="!space-x-2">
  <svelte:fragment slot="lead">
    <div class="flex items-center space-x-0">
      <!-- Hamburger Menu -->
      <button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
        <i class="fa-solid fa-bars text-xl" />
      </button>
      <!-- Logo -->
      <a class="lg:!ml-0 w-[32px] lg:w-auto overflow-hidden flex" href="/" title="Go to Homepage">
        <img class="w-12 h-12" src='/favicon.svg' /> 
        <!-- <LogoFull/> -->
        <!-- <span class="text-lg font-bold"> {$page.data.company?.name}</span> -->
      </a>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="trail">
    <!-- Auth -->
    <div>
      <!-- trigger -->
      <button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'user' }}>
        <i class="fa-solid fa-user text-lg md:!hidden" />
        <span class="hidden md:inline-block capitalize"
          >{$page.data?.user?.username ?? 'Account'}</span
        >
        <i class="fa-solid fa-caret-down opacity-50" />
      </button>
      <!-- popup -->
      <div class="card p-4 w-60 shadow-xl" data-popup="user">
        <nav class="list-nav">
          <ul>
            {#if $page.data.user}
              <li>
                <a href="/account">
                  <span class="w-6 text-center"><i class="fa-solid fa-user-md" /></span>
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <form method="POST" action="/logout">
                  <button class="w-full" type="submit">
                    <span class="w-6 text-center"><i class="fa fa-sign-out" /></span>
                    <span>Logout</span>
                  </button>
                </form>
              </li>
            {:else}
              <li>
                <a href="/login">
                  <span class="w-6 text-center"><i class="fa-solid fa-sign-in" /></span>
                  <span>Login</span>
                </a>
              </li>
              <li>
                <a href="/register">
                  <span class="w-6 text-center"><i class="fa-solid fa-user-plus" /></span>
                  <span>Register</span>
                </a>
              </li>
            {/if}
          </ul>
        </nav>
        <!-- <div class="arrow bg-surface-100-800-token" /> -->
      </div>
    </div>

    <!-- Explore -->
    <div class="relative hidden lg:block">
      <!-- trigger -->
      <button
        class="btn hover:variant-soft-primary"
        use:popup={{ event: 'click', target: 'features', closeQuery: 'a[href]' }}
      >
        <span>Explore</span>
        <i class="fa-solid fa-caret-down opacity-50" />
      </button>
      <!-- popup -->
      <div class="card p-4 w-60 shadow-xl" data-popup="features">
        <nav class="list-nav">
          <ul>
            {#each Object.entries($page.data?.links) as [key, value]}
              <!-- content here -->
              <li>
                <div class="relative hidden lg:block">
                  <!-- trigger -->
                  <button
                    class="li capitalize hover:variant-soft-primary w-full text-right"
                    use:popup={{ event: 'hover', target: key, closeQuery: 'a[href]' }}
                  >
                    <i class={`fa ${value[0]?.icon_font_awesome} opacity-50`} />
                    <span>{key?.split('/')?.join(' ')}</span>
                  </button>
                  <!-- popup -->
                  <div class="card z-10 p-4 w-60 shadow-xl" data-popup={key}>
                    <nav class="list-nav">
                      <ul>
                        {#each value ?? [] as sub_value}
                          {#each sub_value?.list as list_value}
                            <!-- content here -->
                            <li>
                              <a href={`${sub_value?.link}${list_value?.href}`}>
                                <span class="w-6 text-center"
                                  ><i class={`fa ${value[0]?.icon_font_awesome}`} /></span
                                >
                                <span class="capitalize">{list_value?.label}</span>
                              </a>
                            </li>
                          {/each}
                        {/each}
                      </ul>
                    </nav>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </nav>
        <!-- <div class="arrow bg-surface-100-800-token" /> -->
      </div>
    </div>

    <!-- Theme -->
    <div>
      <!-- trigger -->
      <button
        class="btn hover:variant-soft-primary"
        use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
      >
        <i class="fa-solid fa-palette text-lg md:!hidden" />
        <span class="hidden md:inline-block">Theme</span>
        <i class="fa-solid fa-caret-down opacity-50" />
      </button>
      <!-- popup -->
      <div class="card p-4 w-60 shadow-xl" data-popup="theme">
        <div class="space-y-4">
          <section class="flex justify-between items-center">
            <h6 class="h6">Mode</h6>
            <LightSwitch />
          </section>
          <hr />
          <nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
            <form action="/?/setTheme" method="POST" use:enhance={setTheme}>
              <ul>
                {#each themes as { icon, name, type, badge }}
                  <li>
                    <button
                      class="option w-full h-full"
                      type="submit"
                      name="theme"
                      value={type}
                      class:bg-primary-active-token={$storeTheme === type}
                    >
                      <span>{icon}</span>
                      <span class="flex-auto text-left">{name}</span>
                      {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if}
                    </button>
                  </li>
                {/each}
              </ul>
            </form>
          </nav>
          <hr />
          <div>
            <a class="btn variant-filled w-full" href="/docs/generator">Create a Theme</a>
          </div>
        </div>
        <!-- <div class="arrow bg-surface-100-800-token" /> -->
      </div>
    </div>

    {#if !$page.data?.user}
      <!-- Login Form -->
      <div class="relative hidden lg:block">
        <!-- trigger -->
        <button
          class="btn hover:variant-soft-primary"
          use:popup={{ event: 'click', target: 'login' }}
        >
          <span>Login</span>
          <i class="fa-solid fa-caret-down opacity-50" />
        </button>
        <!-- popup -->
        <div class="card p-4 w-60 shadow-xl" data-popup="login">
          <nav class="list-nav">
            <LoginForm />
          </nav>
        </div>
      </div>
    {/if}

    <!-- Search -->
    <div class="md:inline md:ml-4">
      <button
        class="btn space-x-4 variant-soft hover:variant-soft-primary"
        on:click={triggerSearch}
      >
        <i class="fa-solid fa-magnifying-glass text-sm" />
        <small class="hidden md:inline-block">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
      </button>
    </div>

    <!-- Social -->
    <section class="hidden sm:inline-flex space-x-1">
      <a
        class="btn-icon hover:variant-soft-primary"
        href="https://github.com/skeletonlabs/skeleton"
        target="_blank"
        rel="noreferrer"
      >
        <i class="fa-brands fa-github text-lg" />
      </a>
      <a
        class="btn-icon hover:variant-soft-primary"
        href="https://discord.gg/EXqV7W8MtY"
        target="_blank"
        rel="noreferrer"
      >
        <i class="fa-brands fa-discord text-lg" />
      </a>
    </section>
  </svelte:fragment>
</AppBar>
