<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Files, ImageIcon, Loader2, Pencil, PlusCircle, UploadCloud, X } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { cn } from '$lib/utils';
	import type { Attachment } from '$lib/types';
	import { fly, slide } from 'svelte/transition';

	export let attachments: Attachment[] = [];


	let isEditing = false;
	let fileInput: FileList | null;
	let deletingId: string | null = null;
	let deleting: string[] = [];
	let uploading = false;
	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course attachments

		<Button on:click={toggleEdit} variant="ghost">
			{#if isEditing}
				cancel
			{:else if !attachments.length}
				<PlusCircle class="mr-2 size-4" />
				add a file
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit File
			{/if}
		</Button>
	</div>
	{#if isEditing}
		<form
			method="post"
			enctype="multipart/form-data"
			action="?/createAttachment"
			use:enhance={() => {
				uploading = true;
				return async ({ update, result }) => {
					await update();
					uploading = false;
					fileInput = null;
					if (result) {
						if (result.type === 'failure') {
							toast.error(result.data?.message?.toString() || '');
						}
						if (result.type === 'error') {
							toast.error(result.error.message);
						}
						if (result.type === 'success') {
							toast.success(result.data?.message?.toString() || '');

							toggleEdit();
						}
					}
					invalidateAll();
				};
			}}
			class=" mt-4"
		>
			<div class="relative">
				<input
					type="file"
					class=" h-60 w-full rounded-md border border-slate-300 bg-transparent text-transparent file:hidden"
					name="attachment"
					bind:files={fileInput}
				/>
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center"
				>
					<UploadCloud class="mx-auto h-10 w-10 " />
					<div>
						<p class="text-sm font-semibold capitalize text-blue-600">
							choose file or drag and drop
						</p>
						<p class="text-sm">text, image, video, audio, and pdf</p>
					</div>
					{#if fileInput?.length === 1}
						<button
							class="pointer-events-auto rounded-md bg-blue-700 px-3 py-2 font-semibold capitalize text-white"
							type="submit"
						>
							{#if uploading}
								<Loader2 class="size-6 animate-spin " />
							{:else}
								upload {fileInput?.length} file
							{/if}
						</button>
					{/if}
				</div>
			</div>

			<p class="mt-4 text-xs text-muted-foreground">
				Add anything your students might need to complete this course
			</p>
		</form>
	{:else if attachments.length}
		{#each attachments.filter((attachment) => !deleting.includes(attachment.id)) as attachment (attachment.id)}
			<div
				class="mb-2 flex w-full items-center gap-x-2 rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
				in:fly={{ y: 20 }}
				out:slide
			>
				<Files className="w-4 h-4 m-2 flex-shrink-0" />

				<p class="line-clamp-1 text-xs">
					{attachment.name}
				</p>
				<form
					action="?/deleteAttachment"
					method="POST"
					use:enhance={() => {
						deleting = [...deleting, attachment.id];
						toast.success('successfully deleted course attachment');

						return async ({ update, result }) => {
							await update();
							deleting = deleting.filter((id) => id !== attachment.id);
							if (result) {
								if (result.type === 'failure') {
									toast.error(result.data?.message?.toString() || '');
								}
								if (result.type === 'error') {
									toast.error(result.error.message);
								}
							}
						};
					}}
					class="ml-auto"
				>
					<input type="hidden" name="id" value={attachment.id} />

					<button class=" transition-all hover:opacity-75">
						<X class="size-4 " />
					</button>
				</form>
			</div>
		{/each}
	{:else}
		<p class="mt-2 text-sm italic text-muted-foreground">No attachment yet</p>
	{/if}
</div>
