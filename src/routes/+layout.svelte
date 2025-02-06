<script lang="ts">
	import '@fontsource/poppins';
	import '../app.css';
	let { children } = $props();
</script>

<main class="h-screen">
	{@render children()}
</main>
