<script lang="ts">
	import type { Chapter } from '$lib/types';
	import { flip } from 'svelte/animate';
	import { cn } from '$lib/utils';
	import { dndzone } from 'svelte-dnd-action';
	import { Badge, GripIcon, Pencil } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let items: Chapter[] = [];

	const flipDurationMs = 150;
	function handleConsider(e: CustomEvent<DndEvent<Chapter>>) {
		const { detail } = e;
		const { items: newItems } = detail;
		items = newItems;
	}

	function handleFinalize(e: CustomEvent<DndEvent<Chapter>>) {
		const { detail } = e;
		const { items: newItems } = detail;
		items = newItems;
	}
</script>

<ul
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each items as item (item.id)}
		<li
			animate:flip={{ duration: flipDurationMs }}
			id={item.id}
			class={cn(
				'mb-4 flex items-center gap-x-2 rounded-md border border-b bg-slate-200 p-2 text-sm text-slate-700',
				{ 'border-sky-200 bg-sky-200 text-sky-700': item.isPublished }
			)}
		>
			<div
				class={cn(
					'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
					{
						'hover: border-r-sky-200 bg-sky-300': item.isPublished
					}
				)}
			>
				<GripIcon class="size-5 " />
			</div>
			<p class="truncate">
				{item.title}
			</p>
			<div class="ml-auto flex items-center gap-x-2 pr-2">
				{#if item.isFree}
					<Badge>Free</Badge>
				{/if}
				<Badge class={cn('bg-slate-500', { 'bg-sky-700': item.isPublished })}
					>{item.isPublished ? 'published' : 'draft'}</Badge
				>
				<a href="{$page.url.pathname}/chapters/{item.id}"> <Pencil class="size-5" /></a>
			</div>
		</li>
	{/each}
</ul>
