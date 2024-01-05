<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { InputChip, SlideToggle, ProgressRadial } from '@skeletonlabs/skeleton';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Preview from './Preview.svelte';
  import { writable } from 'svelte/store';

  let markdown = '';

  // Local
  onMount(() => {
    // CodeBlock Highlight
    document.querySelectorAll('pre code').forEach((elem: any) => {
      hljs.highlightElement(elem);
    });
    // ordered list
    document.querySelectorAll('ol').forEach((elem: any) => {
      elem.classList.add('list');
    });
  });

  let preview = false;
  let list: string[] = ['foo', 'bar'];
  let titleValue: string = '';

  let obj_id: any = null;
  page.subscribe((page) => {
    page.data?.links[`/${page.params.main_link}`]?.forEach((elem: any) => {
      const links = elem?.list;
      if (Array.isArray(links)) {
        obj_id = links.find((e) => e?.href == `/${page.params?.sub_link}`)?.id;
      }
    });
  });

  const prompting = writable(false);
  const saving = writable(false);

  let prompt = '';
  const headers = {
    'Content-Type': 'application/json'
  };
  function onSubmit() {
    prompting.set(true);
    fetch('/api/ai', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ prompt })
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        prompting.set(false);
        console.log('++ai content');
        markdown = data;
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
        prompting.set(false);
      });
  }
</script>

<form class="m-4" on:submit|preventDefault={onSubmit}>
  <span>Prompt the palm AI</span>
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div>
      {#if $prompting}
        <button class="btn variant-filled" type="button">
          <ProgressRadial width="w-8" stroke={150} />prompting...
        </button>
      {:else}
        <button class="btn variant-filled" type="submit">Send</button>
      {/if}
    </div>
    <!-- <div class="input-group-shim" /> -->
    <textarea
      class="textarea"
      name="prompt"
      bind:value={prompt}
      rows="4"
      minlength="2"
      required
      placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
    />
  </div>
</form>

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
    formData.append('category_id', obj_id);
    const res = await fetch('/api/article', {
      method: 'POST',
      body: formData
    }).then(async (res) => await res.json());
    saving.set(false);
    // console.log(res);
    if (!res?.error) {
      goto(`/${$page?.params?.main_link}/${$page?.params?.sub_link}/1/${res?.record?.id}`);
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
    <span>Article Cover Image</span>
    <input
      type="file"
      accept="image/*"
      name="cover_image"
      class="input w-1/2"
      placeholder="Cover Image"
      required
    />
  </label>

  <!-- <label class="label">
    <span>Excerpt</span>
    <textarea
      class="textarea"
      name="excerpt"
      rows="3"
      placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
    />
  </label> -->

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
    <SlideToggle name="slider-label" on:change={() => (preview = !preview)} checked={preview}
      >Preview</SlideToggle
    >
    <button type="button" class="btn variant-filled">Images</button>
  </div>
  {#if !preview}
    <!-- content here -->
    <label class="label">
      <span>Article Content :: Markdown Editor</span>
      <div class="flex">
        <div class="w-full h-96">
          <!-- Declare a textarea where the user can enter markdown, and bind it to the variable `markdown` -->
          <textarea
            name="content"
            class="textarea h-auto min-h-full w-full p-2"
            bind:value={markdown}
            placeholder="Enter markdown here"
          />
        </div>
      </div>
    </label>
  {:else}
    <Preview {markdown} />
  {/if}

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
