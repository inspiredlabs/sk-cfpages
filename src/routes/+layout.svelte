<script>
	// learn: stackoverflow.com/questions/64245188/how-to-differentiate-between-svelte-dev-mode-and-build-mode#answer-68074574
	// import { dev, browser } from '$app/environment';
	
	import '$src/app.css';
	</script>
	
	<!-- Analytics, JSON-LD, SEO -->
	<!-- <svelte:head>
		{#if !dev }
			
		{/if}
	</svelte:head> -->
	
	<slot />
	
	<style>
	/* Global styles */
	:global(body, html) {
		margin:0;
		padding:0;
	}
	</style>