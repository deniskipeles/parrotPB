<script lang="ts">
  import '../app.postcss';

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
  import { afterNavigate } from '$app/navigation';
  import { storePreview, storeTheme } from '$lib/stores';
  import { browser } from '$app/environment';

  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { storeHighlightJs } from '@skeletonlabs/skeleton';
  import { getSubText } from '$lib/utils';
  
  import MathJax from '$lib/editor/MathJax.svelte';
  import MermaidDiagram from '$lib/editor/MermaidDiagram.svelte';

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
  afterNavigate((params: any) => {
    // Scroll to top
    const isNewPage: boolean =
      params.from && params.to && params.from.route.id !== params.to.route.id;
    const elemPage = document.querySelector('#page');
    if (isNewPage && elemPage !== null) {
      elemPage.scrollTop = 0;
    }
    // Scroll heading into view
    scrollHeadingIntoView();
  });
  // Reactive
  // Disable left sidebar on homepage
  // $: slotSidebarLeft = matchPathWhitelist($page.url.pathname) ? 'w-0' : 'bg-surface-50-900-token lg:w-auto';
  $: slotSidebarLeft = 'bg-surface-50-900-token lg:w-auto';
  $: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';

  export let data;
</script>

<svelte:head>
  <title>{data?.company?.data?.title}</title>
  <meta name="description" content={getSubText(100, data?.company?.data?.description)} />
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
      <!--MermaidDiagram>
            <MathJax math={"§"}></MathJax>
      </MermaidDiagram-->
  </svelte:fragment>
</AppShell>
