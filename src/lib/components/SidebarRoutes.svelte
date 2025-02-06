<script lang="ts">
	import { BarChart, List } from 'lucide-svelte';
	import SideBarItem from './SideBarItem.svelte';

	const routes = [
		{
			icon: List,
			label: 'Courses',
			href: '/teacher/courses'
		},
		{
			icon: BarChart,
			label: 'analytics',
			href: '/teacher/analytics'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, icon, label }}
		<SideBarItem {href} {icon} {label} />
	{/each}
</div>
