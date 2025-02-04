<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { loginSchema } from '$lib/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData,enhance, delayed} = form;

</script>

<div>
	<h1 class="py-5 text-center text-2xl font-semibold">Welcome</h1>

	<form method="POST" use:enhance>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</form>
</div>
