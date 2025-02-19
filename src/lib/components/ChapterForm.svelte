<script lang="ts">
	import { page } from '$app/stores';
	import { Loader2, Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import type { Chapter } from '$lib/types';
	import { titleSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import ChapterList from './ChapterList.svelte';
	

	export let data: SuperValidated<Infer<typeof titleSchema>>;

	const form = superForm(data, {
		validators: zodClient(titleSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.message && !form.valid) {
				return toast.error(form.message);
			}
			toggleEdit();
			toast.success(form.message);
		}
	});

	const { form: formData, enhance, delayed, submitting } = form;

	export let chapters: Chapter[];
	$: isCreating = false;

	function toggleEdit() {
		isCreating = !isCreating;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex mb-3 items-center justify-between font-medium">
		Course Chapter
		<Button on:click={toggleEdit} type="button" variant="outline">
			{#if isCreating}
				cancel
			{:else}
				<Pencil class="mr-2 size-4" />
			create chapter
			{/if}
		</Button>
	</div>

	{#if isCreating}
		<form
			action="/teacher/courses/{$page.params.courseId}/?/createChapter"
			method="POST"
			class="mt-4 space-y-4"
			use:enhance
		>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Chapter</Form.Label>
					<Input
						{...attrs}
						placeholder="e.g introduction to the course"
						bind:value={$formData.title}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center gap-x-2">
				<Form.Button>
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						save
					{/if}
				</Form.Button>
			</div>
		</form>
	{:else if chapters.length}
		<ChapterList items={chapters} />
		<p class="mt-4 text-sm text-muted-foreground">Drag and drop to re-order the chapters</p>
	{:else}
		<div class="text-slate mt-2 text-sm">no chapters yet</div>
	{/if}
</div>
