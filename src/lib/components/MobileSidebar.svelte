<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Menu } from 'lucide-svelte';
	import SideBar from './Sidebar.svelte';
</script>

<Sheet.Root>
	<Sheet.Trigger class="pr-4 transition hover:opacity-75 md:hidden"><Menu /></Sheet.Trigger>
	<Sheet.Content class="bg-background p-0 md:hidden" side="left">
		<SideBar />
	</Sheet.Content>
</Sheet.Root>
