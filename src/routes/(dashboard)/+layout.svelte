<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import SideBar from '$lib/components/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="grid h-full grid-cols-[200px_1fr_1fr] grid-rows-[100px_1fr]">
	<div class="hidden md:row-span-2 md:block">
		<SideBar />
	</div>
	<div class="col-span-3">
		<Navbar />
	</div>
	<main class="col-span-3 md:col-start-2">
		{@render children()}
	</main>
</div>
