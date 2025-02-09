<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Pencil, PlusCircle } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Loader2 } from 'lucide-svelte';
	import { fileProxy } from 'sveltekit-superforms';
	import { imageSchema } from '$lib/schema';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';

	export let imageUrl: string | undefined;

	let isEditing = false;
	let fileInput: FileList | null;
	let uploading = false;

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="p- mt-6 rounded-md border bg-muted">
	<div class="flex items-center justify-between font-medium">
		Course Image
		<Button on:click={toggleEdit} variant="outline" on:click={toggleEdit}>
			{#if isEditing}
				cancel
			{:else if !imageUrl}
				<PlusCircle class="mr-2 size-4" />
				add an image
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit Image
			{/if}
		</Button>
	</div>

	{#if isEditing}
		<form action="?/updateImage" method="POST" class="mt-4 " use:enhance enctype="multipart/form-data">
			<input type="file" name="image" accept="image/*" bind:files={$file} />
			<Button type="submit" disabled={uploading}>
				{#if uploading}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Upload
				{/if}
			</Button>
		</form>
	{/if}
</div>
