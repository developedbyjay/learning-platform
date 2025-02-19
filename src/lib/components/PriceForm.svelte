<script lang="ts">
	import { Pencil, Loader2 } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
    import Input from './ui/input/input.svelte';
	import { page } from '$app/stores';
	import { priceSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { cn, formatCurrency } from '$lib/utils';
	import { fly } from 'svelte/transition';

	export let data: SuperValidated<Infer<typeof priceSchema>>;

	$: isEditting = false;

	function toggleEdit() {
		isEditting = !isEditting;
	}

	const form = superForm(data, {
		validators: zodClient(priceSchema),
		// resetForm: false,
		onUpdated({ form }) {
			if (form.message && !form.valid) {
				return toast.error(form.message);
			}
			toggleEdit();
			toast.success(form.message);
		}
	});

	$:price = data.data.price;
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course Price
		<Button variant="outline" on:click={toggleEdit}>
			{#if isEditting}
				cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit Price
			{/if}
		</Button>
	</div>

	{#if !isEditting}
		<p
			class={cn('mt-2 break-all text-sm', {
				'text-muted-foreground': !data.data.price
			})}
		>
			{price && formatCurrency(price) || 'No price'}
		</p>
	{:else}
		<form
			action="/teacher/courses/{$page.params.courseId}/?/updatePrice"
			method="POST"
			use:enhance
			class="mt-4 space-y-4"
			transition:fly
		>
			<Form.Field {form} name="price">
				<Form.Control let:attrs>
					<Form.Label>Price</Form.Label>
					<Input {...attrs} placeholder="200" type="number" bind:value={$formData.price} step="0.01" />
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
