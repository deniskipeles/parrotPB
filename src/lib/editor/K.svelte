<script>
  import {
    onMount,
    afterNavigate
  } from "svelte"
  // import katex from "katex"

  let mounted = false
  let mounted_track = 0
  onMount(()=>{
    mounted=true;
    mounted_track=1
  })
  afterNavigate(()=>mounted_track+=1)
  
  $: if(mounted && mounted_track>0){
    document.addEventListener("DOMContentLoaded", function () {
    // Select all 'article' elements
    const articleElements = document.querySelectorAll("article");
  
    // Loop through each 'article' element
    articleElements.forEach((articleElement) => {
      renderMathInElement(articleElement, {
        // Customized options
        // • Auto-render specific keys, e.g.:
        delimiters: [
          {
            left: "$$",
            right: "$$",
            display: true,
          },
          {
            left: "$",
            right: "$",
            display: true,
          },
          {
            left: "\\(",
            right: "\\)",
            display: false,
          },
          {
            left: "\\begin{equation}",
            right: "\\end{equation}",
            display: true,
          },
          {
            left: "\\begin{align}",
            right: "\\end{align}",
            display: true,
          },
          {
            left: "\\begin{alignat}",
            right: "\\end{alignat}",
            display: true,
          },
          {
            left: "\\begin{gather}",
            right: "\\end{gather}",
            display: true,
          },
          {
            left: "\\begin{CD}",
            right: "\\end{CD}",
            display: true,
          },
          {
            left: "\\[",
            right: "\\]",
            display: true,
          },
        ],
  
        // • Rendering keys, e.g.:
        throwOnError: false,
      });
    });
  });
  }

</script>


<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body);"></script>
</svelte:head>
<span><slot /></span>