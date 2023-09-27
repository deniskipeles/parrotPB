<script lang="ts">
	import { page } from '$app/stores';
    import LogoFull from '$lib/components/icons/LogoFull.svelte';
</script>

{#if $page}
	<div class="w-full h-full flex justify-center items-center">
		<div class="text-center space-y-4">
			<LogoFull />
			<h2 class="h2">
				{$page.status}:{#if $page.error} {$page.error.message} {/if}
			</h2>
			<p>We're sorry, something went wrong.</p>
		</div>
	</div>
{/if}
