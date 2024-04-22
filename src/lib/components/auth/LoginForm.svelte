<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { Error } from '$lib/components';
  import { pb } from '$lib/pocketbase';
  import { ProgressRadial } from '@skeletonlabs/skeleton';
  let pass_text = 'password';

  let loading = false;
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
      <span>User Type</span>
      <div class="space-y-2 flex gap-4">
        <label class="flex items-center space-x-2">
          <input value="clients" class="radio" type="radio" checked name="auth_table" />
          <p>Client</p>
        </label>
        <label class="flex items-center space-x-2">
          <input value="developers" class="radio" type="radio" name="auth_table" />
          <p>Developer</p>
        </label>
      </div>
    </label>

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
