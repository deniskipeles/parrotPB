<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { Error, LayoutPage } from '$lib/components';
  import { pb } from '$lib/pocketbase';
  import { ProgressRadial } from '@skeletonlabs/skeleton';
  
  import { page } from '$app/stores';
  import Auth2 from '$lib/components/auth/Auth2.svelte';
  
  let pass_text = 'password';

  /** @type {import('./$types').ActionData} */
  export let form: any;
  let loading = false;
  
  const authTables = ($page.data?.tables?.filter(i=>i?.type == 'auth'))?.map(i=>i.name)
  let group = authTables.length ? authTables[0] :"";
</script>

<LayoutPage>
  {#if form?.error}
    <Error error={form?.error} />
  {/if}
  <form
    action=""
    method="post"
    use:enhance={() => {
      loading = true;
      return async ({ result }) => {
        pb.authStore.loadFromCookie(document.cookie);
        await applyAction(result);
        loading = false;
        if (!form?.incorrect) {
          invalidateAll();
        }
      };
    }}
  >
    <div class="card p-4 w-full text-token space-y-4">
      <label class="label">
      <span>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign up to our platform{authTables.length > 1 ?" As:":":"}</h3>
      </span>
      <div class="space-y-2 flex gap-4">
			{#if authTables.length >1}
    		{#each authTables as item}
    			<label class="flex items-center space-x-2">
          <input value={item} class="radio" type="radio" bind:group name="auth_table" />
          <p>{$page.data?.wapp?.data?.auth_collection[item] ?? item}</p>
          </label>
    		{/each}
  		{/if}
      </div>
    </label>
    <Auth2 display_sign="Register" auth_collection={group}/>

      <label class="label">
        <span>Email</span>
        <input name="email" class="input" type="email" placeholder="Input" />
      </label>
      <label class="label">
        <span>Password</span>
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
      </label>
      <label class="label">
        <span>Confirm Password</span>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
          <input name="passwordConfirm" type={pass_text} placeholder="••••••••••" />
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
      </label>
      <div class="w-full items-center">
        {#if loading}
          <button type="button" class="btn variant-filled w-full">
            <ProgressRadial width="w-8" stroke={100} />loading...
          </button>
        {:else}
          <button type="submit" class="btn variant-filled w-full">Register</button>
        {/if}
      </div>
    </div>
  </form>
</LayoutPage>
