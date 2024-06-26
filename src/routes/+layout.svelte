<script lang="ts">
  import '../app.postcss';
  //import "//cdn.jsdelivr.net/gh/deniskipeles/static@master/js/pagepilot.js"
  

  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let currentTile = 0;

  // Components & Utilities
  import {
    AppShell,
    Modal,
    Toast,
    initializeStores,
    prefersReducedMotionStore
  } from '@skeletonlabs/skeleton';
  // Dependency: Floating UI
  import { storePopup } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  import { Sidebar, Footer, CustomAppBar, Drawer, PageSearch } from '$lib/components';
  // Types
  import type { ModalComponent } from '@skeletonlabs/skeleton';
  import { writable, get } from 'svelte/store';
  import { beforeNavigate, afterNavigate, disableScrollHandling } from '$app/navigation';
  import { storePreview, storeTheme } from '$lib/stores';
  import { browser } from '$app/environment';

  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { storeHighlightJs } from '@skeletonlabs/skeleton';
  import { getSubText } from '$lib/utils';
  
  import MathJax from '$lib/editor/MathJax.svelte';
  import MermaidDiagram from '$lib/editor/MermaidDiagram.svelte';
  
  //ai page assistant
  const loadPagepilot = () => {
		let script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/gh/deniskipeles/static@master/js/pagepilot.js"
    document.head.append(script);
		script.onload = () => {
      console.log("pagepilot initialized")
		};
	};
	const loadEruda = () => {
		let script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/npm/eruda"
    document.head.append(script);
		script.onload = () => {
      window.eruda.init();
		};
	};
	onMount(()=>{
	  loadEruda()
	  loadPagepilot()
	  disableScrollHandling()
	})

  storeHighlightJs.set(hljs);

  // Registered list of Components for Modals
  const modalComponentRegistry: Record<string, ModalComponent> = {
    modalSearch: { ref: PageSearch }
    // exampleList: { ref: ModalExampleList },
    // exampleEmbed: { ref: ModalExampleEmbed },
    // exampleImage: { ref: ModalExampleImage }
  };
  initializeStores();

  // Set body `data-theme` based on current theme status
  storePreview.subscribe(setBodyThemeAttribute);
  storeTheme.subscribe(setBodyThemeAttribute);
  function setBodyThemeAttribute(): void {
    if (!browser) return;
    document.body.setAttribute('data-theme', $storePreview ? 'generator' : $storeTheme);
  }
  // Scroll heading into view
  function scrollHeadingIntoView(): void {
    if (!window.location.hash) return;
    const elemTarget: HTMLElement | null = document.querySelector(window.location.hash);
    if (elemTarget) elemTarget.scrollIntoView({ behavior: 'smooth' });
  }

  // Lifecycle
  /*afterNavigate((params: any) => {
    // Scroll to top
    const isNewPage: boolean =
      params.from && params.to && params.from.route.id !== params.to.route.id;
    const elemPage = document.querySelector('#page');
    if (isNewPage && elemPage !== null) {
      elemPage.scrollTop = 0;
    }
    // Scroll heading into view
    scrollHeadingIntoView();
  });*/
  // Reactive
  // Disable left sidebar on homepage
  // $: slotSidebarLeft = matchPathWhitelist($page.url.pathname) ? 'w-0' : 'bg-surface-50-900-token lg:w-auto';
  $: slotSidebarLeft = 'bg-surface-50-900-token lg:w-auto';
  $: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';

  export let data;


  

  const scrollPositionStore = writable({});

  beforeNavigate(({ to, from }) => {
    // Store the scroll position of the current page
    if (from) {
      const scrollPosition = window.scrollY;
      scrollPositionStore.update((prev) => ({ ...prev, [from.route.id]: scrollPosition }));
    }
  });

  afterNavigate(({ to }) => {
    // Restore the scroll position of the previous page
    if (to) {
      const storedScrollPosition = get(scrollPositionStore)[to.route.id];
      if (storedScrollPosition !== undefined) {
        window.scrollTo(0, storedScrollPosition);
      }
    }
  });
</script>


<svelte:head>
  <title>{$page.data?.wapp?.data?.title ?? "ktechs documentation page"}</title>
  <meta name="description" content={$page.data?.wapp?.data?.description ?? "ktechs docs is a wordpress alternative for ai generated content"} />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">
</svelte:head>

<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<Toast />
<Drawer />
<!-- App Shell -->

<AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll} slotFooter="bg-black p-4">
  <svelte:fragment slot="header">
    <CustomAppBar />
  </svelte:fragment>
  <!-- Sidebar (Left) -->
  <svelte:fragment slot="sidebarLeft">
    <Sidebar class="hidden lg:grid w-[360px] overflow-hidden" />
  </svelte:fragment>

  <!-- Page Content -->
    <slot />
  

  <!-- Page Footer -->
  <svelte:fragment slot="pageFooter">
    <Footer />
  </svelte:fragment>
</AppShell>
