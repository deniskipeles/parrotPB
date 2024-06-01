<!--AutoExpandTextarea component-->
<script>
  import { onMount } from "svelte";

  export let value = "";
  export let maxHeight = 500;

  let inputElem;
  let updateTimeoutId;

  $: if (typeof value !== undefined) {
    updateInputHeight();
  }

  function updateInputHeight() {
    clearTimeout(updateTimeoutId);
    updateTimeoutId = setTimeout(() => {
      if (inputElem) {
        inputElem.style.height = ""; // reset
        inputElem.style.height = Math.min(inputElem.scrollHeight, maxHeight) + "px";
      }
    }, 0);
  }

  function handleKeydown(e) {
    if (e?.code === "Enter" && !e?.shiftKey && !e?.isComposing) {
      e.preventDefault();

      const form = inputElem.closest("form");
      form?.requestSubmit && form.requestSubmit();
    }
  }

  onMount(() => {
    maxHeight=window.innerHeight;
    updateInputHeight();

    return () => clearTimeout(updateTimeoutId);
  });
</script>


<style>
  #mtextarea {
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    padding: 0.5rem 0.5rem 1.5rem;
    min-width: 100%;
    max-width: 72rem;
    min-height: 8rem;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
	  padding-top: 7px !important;
    padding-bottom: 6px !important;
  }

  #mtextarea:focus {
    border-color: #2563eb;
  }

  #mtextarea.dark {
    background-color: #1a202c;
    border-color: #2d3748;
  }

  #mtextarea.dark:focus {
    border-color: #15438e;
  }
</style>


<textarea id="mtextarea" bind:this={inputElem} bind:value on:keydown={handleKeydown} {...$$restProps} />

	