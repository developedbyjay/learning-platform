<script lang="ts">
	import '@fontsource/poppins';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<Toaster richColors closeButton theme="light" />
<ModeWatcher defaultMode={'light'} />
<main class="h-screen">
	{@render children()}
</main>
