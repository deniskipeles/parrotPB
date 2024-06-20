<script>
  export let images = []
  $: images_ = images?.map(i=>`https://drogon-app.onrender.com/400x/${i}`)
</script>

<section class="grid grid-cols-2 md:grid-cols-4 gap-2">
  {#each Array.from({ length: Math.ceil(images_.length / 3) }) as _, i}
  <div class="grid gap-4">
    {#each images_.slice(i * 3, (i + 1) * 3) as image}
    <div>
      <img class="h-auto max-w-full rounded-lg" src={image} alt="" />
    </div>
    {/each}
  </div>
  {/each}
</section>