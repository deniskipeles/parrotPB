<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { Error } from '$lib/components';
  import { pb } from '$lib/pocketbase';
  import { ProgressRadial } from '@skeletonlabs/skeleton';
  let pass_text = 'password';

  let loading = false;
  const authTables = ($page.tables?.filter(i=>i?.type == 'auth'))?.map(i=>i.name)
  let group = authTables[0];
	
</script>

{#if $page.form?.error}
  <Error error={$page.form?.error} />
{/if}
<form
  action="/login"
  method="post"
  use:enhance={() => {
    loading = true;
    return async ({ result }) => {
      pb.authStore.loadFromCookie(document.cookie);
      await applyAction(result);
      loading = false;
      if (!$page.form?.incorrect) {
        invalidateAll();
      }
    };
  }}
>
  <div class="card p-4 w-full text-token space-y-4">
    <label class="label">
      <span>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to our platform{authTables.length > 1 ?" As:":":"}</h3>
      </span>
      <div class="space-y-2 flex gap-4">
			{#if authTables.length >1}
    		{#each authTables as item}
    			<label class="flex items-center space-x-2">
          <input value={item} class="radio" type="radio" bind:group name="auth_table" />
          <p>{$page?.wapp?.data?.auth_collection[item] ?? item}</p>
          </label>
    		{/each}
  		{/if}
      </div>
    </label>
    <Auth2 auth_collection={group}/>

    <label class="label">
      <span>Email/Username</span>
      <input name="email" class="input" type="text" placeholder="Input" />
    </label>
    <p>Password</p>
    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
      <input name="password" type={pass_text} placeholder="••••••••••" />
      {#if pass_text == 'password'}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => (pass_text = 'text')} title="View password.">
          <i class="fa fa-eye-slash" />
        </a>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => (pass_text = 'password')} title="Mask password.">
          <i class="fa fa-eye" />
        </a>
      {/if}
    </div>
    <div class="w-full items-center">
      {#if loading}
        <button type="button" class="btn variant-filled w-full">
          <ProgressRadial width="w-8" stroke={100} />loading...
        </button>
      {:else}
        <button type="submit" class="btn variant-filled w-full">Login</button>
      {/if}
    </div>
  </div>
</form>
