<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from './ui/button/button.svelte';
	import { Loader2, Pencil } from 'lucide-svelte';
	import { categorySchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';

	import type { Category } from '$lib/types';

	export let data: SuperValidated<Infer<typeof categorySchema>>;

	export let categories: Category[];

	let isEditting = false;

	function toggleEdit() {
		isEditting = !isEditting;
	}

	const form = superForm(data, {
		validators: zodClient(categorySchema),
		onUpdated({ form }) {
			if (form.message && !form.valid) {
				return toast.error(form.message);
			}
			toggleEdit();
			toast.success(form.message);
		}
	});

	const { form: formData, enhance, delayed, submitting } = form;

	$: selectedValue =
		categories.find((category) => category.id === $formData.category)?.name || 'No category';

	$: selectedCategory = $formData.category
		? { label: selectedValue, value: $formData.category }
		: undefined;
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium mb-4">
		Course Category
		<Button variant="outline" on:click={toggleEdit}>
			{#if isEditting}
				cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit Category
			{/if}
		</Button>
	</div>
	{#if !isEditting}
		<p
			class={cn('mt-2 break-all text-sm', {
				'text-muted-foreground': !data.data.category
			})}
		>
			{selectedValue || 'No category'}
		</p>
	{:else}
		<form action="?/updateCategory" method="POST" use:enhance class="w-full space-y-6">
			<Form.Field {form} name="category">
				<Form.Control let:attrs>
					<Select.Root
						selected={selectedCategory}
						onSelectedChange={(v) => {
							if (v) $formData.category = v.value;
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select a ctegory" />
						</Select.Trigger>
						<Select.Content class="w-60">
							{#each categories as category}
								<Select.Item value={category.id} label={category.name}>{category.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input type="text" hidden name={attrs.name} bind:value={$formData.category} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button>
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					save
				{/if}
			</Form.Button>
		</form>
	{/if}
</div>
