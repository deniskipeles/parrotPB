<script>
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	export let math="";
	let mathContent ='';
	const dispatch = createEventDispatcher();
	
	const loadMathJax = () => {
		let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
    document.head.append(script);
		
		script.onload = () => {
      MathJax = {
        tex: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
          ],
          tags: 'ams'
        },
        svg: {fontCache: 'global'}
      };
      /*MathJax.tex= {
				...MathJax.tex,
        tags: 'ams'
      }*/
		};
	};
	
	onMount(() => loadMathJax());
  //afterUpdate(() => loadMathJax());
</script>

<p>
	{@html math}
</p>


