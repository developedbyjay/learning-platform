<script lang="ts">
	import { page } from '$app/stores';
	import { Loader2, Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { titleSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	type TitleSchema = typeof titleSchema;

	export let data: SuperValidated<Infer<TitleSchema>>;

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

	$: isEditing = false;

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course Title
		<Button on:click={toggleEdit} type="button" variant="outline">
			{#if isEditing}
				cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit Title
			{/if}
		</Button>
	</div>

	{#if !isEditing}
		<p class="mt-2 text-sm">
			{data.data.title}
		</p>
	{:else}
		<form
			action="/teacher/courses/{$page.params.courseId}/?/updateTitle"
			method="POST"
			class="mt-4 space-y-4"
			use:enhance
		>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input {...attrs} placeholder="advance web development" bind:value={$formData.title} />
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
	{/if}
</div>
