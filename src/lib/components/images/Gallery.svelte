<script>
  export let images = []
</script>

<section class="grid grid-cols-2 md:grid-cols-4 gap-2">
  {#each Array.from({ length: Math.ceil(images.length / 3) }) as _, i}
  <div class="grid gap-4">
    {#each images.slice(i * 3, (i + 1) * 3) as image}
    <div>
      <img class="h-auto max-w-full rounded-lg" src={image} alt="" />
    </div>
    {/each}
  </div>
  {/each}
</section>