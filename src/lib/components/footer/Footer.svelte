<script lang="ts">

	// Logo
	import LogoIcon from '$lib/components/icons/LogoIcon.svelte';

	// Base Classes
	const cBase = 'bg-surface-50 dark:bg-surface-900 border-t border-surface-500/10 text-xs md:text-base';
	const cRowOne = 'flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0';
	const cRowTwo = 'flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0';
</script>

<div class="page-footer {cBase}">
	<div class="w-full max-w-7xl mx-auto p-4 py-16 md:py-24 space-y-10">
		<!-- Row 1 -->
		<section class={cRowOne}>
			<div class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start">
				<a class="lg:!ml-0 w-[32px] lg:w-auto overflow-hidden flex" href="https://www.ktechs.xyz" title="visit ktechs page">
          <img class="w-12 h-12" src='/favicon.svg' /> 
          <!-- <LogoIcon/> -->
        </a>
				<p class="!text-sm opacity-80">parrot</p>
				<!-- Current Version -->
				<span class="badge variant-soft">V 0.1</span>
			</div>
			<div class="hidden md:grid grid-cols-3 gap-8">
				<div class="space-y-6">
					<h6 class="h6">Explore</h6>
					<ul class="space-y-3">
						<li><a class="anchor" href="https://www.ktechs.xyz">ktechs</a></li>
					</ul>
				</div>
				<!--div class="space-y-6">
					<h6 class="h6">Features</h6>
					<ul class="space-y-3">
						<li><a class="anchor" href="https://www.ktechs.xyz">Resources</a></li>
					</ul>
				</div-->
				<div class="space-y-6">
					<h6 class="h6">Project</h6>
					<ul class="space-y-3">
						<li>
							<a class="anchor" href="https://github.com/deniskipeles" target="_blank" rel="noreferrer">Github Page</a>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<hr class="opacity-20" />

		<!-- Row 2 -->
		<section class={cRowTwo}>
			<p>
				<a class="anchor" href="https://github.com/deniskipeles/parrotPB/blob/master/LICENSE" target="_blank" rel="noreferrer">
					MIT License
				</a>
				<span class="opacity-10 mx-2">|</span>
				<a class="anchor" href="https://www.ktechs.xyz/" target="_blank" rel="noreferrer">Ktechs Softwares</a>
			</p>
			<div class="flex space-x-4">
				<a class="btn variant-soft" href="https://github.com/deniskipeles/parrotPB" target="_blank" rel="noreferrer">
					<i class="fa-brands fa-github" />
					<span class="hidden md:inline-block ml-2">Github</span>
				</a>
				<a class="btn variant-soft" href="https://discord.com/invite/4aWD8FxYTU" target="_blank" rel="noreferrer">
					<i class="fa-brands fa-discord" />
					<span class="hidden md:inline-block ml-2">Discord</span>
				</a>
				<a class="btn variant-soft" href="https://twitter.com/KipelesKemboi" target="_blank" rel="noreferrer">
					<i class="fa-brands fa-twitter" />
					<span class="hidden md:inline-block ml-2">Twitter</span>
				</a>
			</div>
		</section>
	</div>
</div>
