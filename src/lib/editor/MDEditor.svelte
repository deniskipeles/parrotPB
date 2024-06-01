<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { InputChip, SlideToggle, ProgressRadial } from '@skeletonlabs/skeleton';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import StackEdit from './StackEdit.svelte';
  import { writable } from 'svelte/store';

  let markdown = '';
  
  let list: string[] = ['foo', 'bar'];
  let titleValue: string = '';
  let url: string = '';

  let obj_id: any = null;
  const saving = writable(false);
  
  function markdownChange(val){
    markdown = val;
  }
  
  
	import MagicTextarea from "./MagicTextarea.svelte";
  import { useCompletion } from 'ai/svelte'
  
  let grog = true
  const { completion, input, isLoading, handleSubmit, data:dt } = useCompletion({
    api:()=>grog?"https://aik-bice.vercel.app/api/completion":"https://aik-bice.vercel.app/api/completion/google",
    onFinish: (prompt, completion) => $input="",
		onError: (error) => console.log(error.message),
  });
  
  let options = {
    textareaClass: "my-textarea-class",
    inputClass: "my-input-class",
    submitButtonClass: "my-submit-button-class",
    divContainerClass: "my-container-class",
    divHeaderClass: "my-header-class",
    divFooterClass: "my-footer-class",
  };
  $:if($completion) markdown = $completion
</script>


<form
  class="form m-4 space-y-6 card"
  method="post"
  action="/api/article"
  use:enhance={async ({ cancel, formData }) => {
    saving.set(true);
    cancel();

    formData.delete('tags');
    formData.append('tags', JSON.stringify(list));
    formData.delete('content');
    formData.append('content', markdown);
    formData.append('sub_menu_list_id', $page?.params?.sub_menu_list_id);
    const res = await fetch('/api/article', {
      method: 'POST',
      body: formData
    }).then(async (res) => await res.json());
    saving.set(false);
    // console.log(res);
    if (!res?.error) {
      goto(`/${$page?.params?.main_link}/${$page?.params?.sub_link}/${$page?.params?.sub_menu_list_id}/${res?.record?.id}`);
    }
  }}
>
  <label class="label">
    <span>Article Title</span>
    <input
      type="text"
      name="title"
      bind:value={titleValue}
      class="input w-full"
      placeholder="New article title here..."
      maxlength="150"
      required
      data-input-field
    />
  </label>

  <label class="label">
    <span>Url</span>
    <input
      type="url"
      name="url"
      bind:value={url}
      class="input w-full"
      placeholder="https://m.youtube.com/watch?v=zR2X9g6Lvck"
      data-input-field
    />
  </label>

  <label class="label">
    <span>Article Cover Image</span>
    <input
      type="file"
      accept="image/*"
      name="cover_image"
      class="input w-1/2"
      placeholder="Cover Image"
    />
  </label>

  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="label">
    <span>Tags</span>
    <InputChip
      required
      class="w-full"
      bind:value={list}
      name="tags"
      placeholder="Add up to 20 keywords (atleast 1 is required)..."
    />
  </label>

  <div class="flex gap-4">
    <SlideToggle name="slider-label" on:change={() => (grog = !grog)} checked={grog}
      >{grog ? "Use gemini":"Use grog"}</SlideToggle
    >
    <StackEdit {markdown} {markdownChange} />
  </div>

  <div class="label">
    <span>Article Content :: Markdown Editor</span>
      <MagicTextarea bind:value={markdown} bind:inputText={$input} isLoading={$isLoading} {handleSubmit} {...options} />
  </div>

  <div class="items-center">
    {#if $saving}
      <button class="btn variant-filled center w-full" type="submit">
        <ProgressRadial stroke={150} width="w-6" />Saving...
      </button>
    {:else}
      <button
        class="btn variant-filled center w-full"
        type="submit"
        title="Create article. Ensure you fill all the fields in this form."
      >
        <span class="span">Create article</span>

        <i class="fa-solid fa-file-pen" />
      </button>
    {/if}
  </div>
</form>
