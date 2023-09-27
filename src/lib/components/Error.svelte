<script lang="ts">
    export let error: {
      response: {
        code: 404;
        message: "The requested resource wasn't found.";
        data: any;
      };
    } | null;
  </script>
  
  <p class="text-xl text-red-800 dark:text-red-900">ERROR:</p>
  
  <div class="text-red-800 dark:text-red-900">
    <p>Code Error: {error?.response?.code}</p>
    <p>Error Message: {error?.response?.message}</p>
    {#if error?.response?.data}
      <ul>
        {#each Object.keys(error?.response?.data) as key}
          <li>{key}: {error?.response?.data[key].message}</li>
        {/each}
      </ul>
    {/if}
  </div>
  