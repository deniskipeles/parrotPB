<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
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
		};
	};
	
	onMount(() => loadMathJax());
  //afterNavigate(() => loadMathJax());
</script>




