<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="p-6">
	<div class="flex items-center py-4">
		<Button href="/teacher/create" class="ml-auto">
			<PlusCircle class="size-4" />
			<span class="ml-4"> New Course </span>
		</Button>
	</div>
</div>
