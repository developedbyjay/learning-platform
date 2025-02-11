<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Pencil, PlusCircle, UploadCloud, ImageIcon } from 'lucide-svelte';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	export let imageUrl: string | undefined;

	let isEditing = false;
	let fileInput: FileList | null;
	let uploading = false;

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium mb-3">
		Course Image
		<Button variant="default" on:click={toggleEdit}>
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
		<form
			action="?/updateImage"
			method="POST"
			class="mt-4"
			use:enhance={() => {
				uploading = true;
				return async ({ update, result }) => {
					await update();
					uploading = false;
					fileInput = null;
					if (result && result.type === 'failure') {
						if (result?.data && typeof result.data.message === 'string') {
							toast.error(result.data.message.toString() || '');
						}
					}
					if (result && result.type === 'error') {
						toast.error(result?.error.message.toString() || '');
					}

					if (result && result.type === 'success') {
						toast.success((result?.data?.message as string).toString() || '');
						toggleEdit();
					}

					invalidateAll();
				};
			}}
			enctype="multipart/form-data"
		>
			<div class="relative">
				<input
					class="h-60 w-full rounded-sm border border-slate-300 bg-transparent text-transparent file:hidden"
					accept="image/*"
					name="image"
					type="file"
					bind:files={fileInput}
				/>

				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center"
				>
					<UploadCloud class="mx-auto size-10 " />

					<div>
						<p class="text-blue mx-auto text-sm font-medium capitalize">
							Drag and drop an image here
						</p>
						<p class="text-sm">image(4mb)</p>
					</div>
					{#if fileInput?.length === 1}
						<button
							class="pointer-events-auto rounded-md bg-blue-700 px-3 py-2 font-semibold capitalize text-white"
							type="submit"
						>
							{#if uploading}
								<Loader2 class="size-6 animate-spin" />
							{:else}
								Upload {fileInput.length} file
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</form>
	{:else if imageUrl}
		<img src={imageUrl} alt="course" class="aspect-video h-60 w-full rounded-md object-cover" />
	{:else}
		<div
			class="mt-3 flex h-60 w-full items-center justify-center rounded-md border border-slate-300 bg-slate-300/20"
		>
			<ImageIcon class="size-10 text-muted-foreground" />
		</div>
	{/if}
</div>
