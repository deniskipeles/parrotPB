
<script>
  import Preview from '$lib/editor/Preview.svelte';
  import StackEdit from '$lib/editor/StackEdit.svelte';
  
  import { Avatar, SlideToggle } from '@skeletonlabs/skeleton';
  
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate, invalidateAll } from '$app/navigation';
  
  export let data={}
  export let edit=false
  export let updateArticle
  export let editFxn
  export let markdownChange
</script>


<div class="flex gap-4">
  {#if $page.data?.user?.id === data.article?.developer_id}
    <div class="flex gap-4">
      <SlideToggle name="slider-label" on:change={() => editFxn()} checked={edit}
        >Edit</SlideToggle
      >
      {#if edit}
      <button on:click={async () => await updateArticle()} type="button" class="btn variant-filled"
        >Save Updates</button
      >
      {/if}
      <StackEdit markdown={data?.article?.content} {markdownChange} />
    </div>
  {/if}
</div>