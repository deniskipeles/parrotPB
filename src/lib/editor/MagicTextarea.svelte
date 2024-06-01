<!--MagicTextarea component-->
<script>
  import Preview from "./Preview.svelte";
  import AutoExpandTextarea from "./AutoExpandTextarea.svelte";

  export let value = '';
  export let inputText = '';
  export let isLoading = false;
  export let handleSubmit = undefined;
	export let textareaClass = '';
	export let inputClass = '';
	export let submitButtonClass = '';
	export let divContainerClass = '';
	export let divHeaderClass = '';
	export let divFooterClass = '';
	
  export let url = 'https://aik-bice.vercel.app/api/completion'; // Replace with your AI streaming API URL

  let res = "";
  let completion = '';
  

  const data = {
    "messages": [],
    "model": "llama3-8b-8192"
  };

  function processStreamedData(data, isFinal = false) {
    const lines = data.split('\n');
    let val = "";

    for (const line of lines) {
      if (line.trim() === '') continue;

      const [type, content] = line.split(':', 2);
      if (!content) continue;

      if (type === '2') {
        try {
          const jsonData = JSON.parse(content);
          console.log('JSON Data:', jsonData);
        } catch (error) {
          console.error('Error parsing JSON: with 2');
        }
      } else if (type === '0') {
        try {
          const jsonData = JSON.parse(content);
          val += jsonData;
        } catch (error) {
          val += content.trim().replace(/^"|"$/g, ''); // Remove leading and trailing quotes
          console.log('Text Data:', content);
        }
      }
    }
    return val;
  }

  async function handleSubmitFetch(e) {
    value = "";
    isLoading = true;

    const obj = { "role": "user", "prompt": inputText };
    data.messages.push(obj);

    try {
      const context = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Authorization': `Bearer `, // If you need to include headers
          'Content-Type': 'application/json'
        }
      };

      for await (let chunk of streamingFetch(() => fetch(url, context))) {
        try {
          value += processStreamedData(chunk);
        } catch (error) {
          // handle error
					console.log(error)
        }
      }
      isLoading = false;
    } catch (error) {
      console.error(error);
      isLoading = false;
    }
  }

  async function* streamingFetch(fetchCall) {
    const response = await fetchCall();

    // Attach Reader
    const reader = response.body.getReader();
    
    while (true) {
      // wait for next encoded chunk
      const { done, value } = await reader.read();

      // check if stream is done
      if (done) inputText = "";
      if (done) break;

      // Decodes data chunk and yields it
      const val = (new TextDecoder("utf-8").decode(value));
      yield val;
    }
  }

  let markedCdn = "";
  let preview = false;
  const handleSubmitCustom=(e)=>{
    value=""
    handleSubmit(e)
  }
</script>


<div class="container {divContainerClass}">
  <div class="header {divHeaderClass}">
    <button
      aria-label="edit/preview"
      type="button"
      class="button"
      on:click={() => preview = !preview}
    >
      {@html !preview ? "preview <span>&#x1F441;</span>" : "edit <span>&#x1F58A;</span><span>&#x1F58B;</span>"}
    </button>
  </div>
  {#if preview}
    <Preview markdown={value} />
  {:else}
    <AutoExpandTextarea
      bind:value
      class={textareaClass}
      placeholder="It was a dark and stormy night..."
      aria-label="Text"
      on:keydown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.form.requestSubmit();
        }
      }}
    />

    <div class="footer {divFooterClass}">
      <input
        class="inputText {inputClass}"
        placeholder="Make the text more unique..."
        bind:value={inputText}
        aria-label="Prompt"
        required
      />

      <button
        aria-label="Submit"
        type="button"
        class="submit-button {submitButtonClass}"
        on:click={(e)=>typeof handleSubmit != "undefined" ? handleSubmitCustom(e) : handleSubmitFetch(e)}
      >
        {#if isLoading}
          <div class="loader"></div>
        {:else}
          &#x2728;
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  /* Loader styles */
  .loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    /*width: 120px;
    height: 120px;*/
    animation: spin 0.1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Container styles */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100%;
    padding: 0.2rem 0;
    flex-grow: 1;
  }

  /* Header styles */
  .header {
    border-radius: 9999px;
    z-index: 50;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    margin-bottom: -1rem;
    display: flex;
    transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
  }

  .header:focus-within {
    border-color: #2563eb;
  }

  /* Button styles */
  .button {
    border-radius: 0.25rem;
    opacity: 0.75;
    background-color: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out;
  }

  .button:hover {
    background-color: #3b82f6;
  }

  .button:active {
    background-color: #1d4ed8;
  }

  /* Footer styles */
  .footer {
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    margin-top: -1.25rem;
    display: flex;
    transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
  }

  .footer:focus-within {
    border-color: #2563eb;
  }

  /* Input styles */
  .inputText {
    background-color: transparent;
    border-radius: 9999px;
    padding: 0.25rem 1rem;
    outline: none;
  }

  /* Submit button styles */
  .submit-button {
    border-radius: 9999px;
    background-color: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out;
  }

  .submit-button:hover {
    background-color: #3b82f6;
  }

  .submit-button:active {
    background-color: #1d4ed8;
	}
</style>
