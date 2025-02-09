<script lang="ts">
	import { Pencil, Loader2 } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { page } from '$app/stores';
	import { descriptionSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn } from '$lib/utils';

	type DescriptionSchema = typeof descriptionSchema;

	export let data: SuperValidated<Infer<DescriptionSchema>>;
	$: isEditting = false;

	function toggleEdit() {
		isEditting = !isEditting;
	}

	const form = superForm(data, {
		validators: zodClient(descriptionSchema),
		onUpdated({ form }) {
			if (form.message && !form.valid) {
				return toast.error(form.message);
			}
			toggleEdit();
			toast.success(form.message);
		}
	});

	const { form: formData, enhance, delayed, submitting } = form;
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course Description
		<Button variant="outline" on:click={toggleEdit}>
			{#if isEditting}
				cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit description
			{/if}
		</Button>
	</div>

	{#if !isEditting}
		<p
			class={cn('mt-2 break-all text-sm', {
				'text-muted-foreground': !data.data.description
			})}
		>
			{data.data.description || 'No description'}
		</p>
	{:else}
		<form
			action="/teacher/courses/{$page.params.courseId}/?/updateDescription"
			method="POST"
			use:enhance
			class="mt-4 space-y-4"
		>
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Textarea
						{...attrs}
						placeholder="these course is about ..."
						bind:value={$formData.description}
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
	{/if}
</div>
