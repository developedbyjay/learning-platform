<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { registerSchema } from '$lib/schema.js';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export var data: any;

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div>
	<h1 class="py-5 text-center text-2xl font-semibold">Sign up</h1>

	<form method="POST" action="/register" use:enhance>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="passwordConfirm">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.passwordConfirm} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="flex space-x-4">
			<Form.Field {form} name="firstName">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input {...attrs} bind:value={$formData.firstName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input {...attrs} bind:value={$formData.lastName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Button class="mt-5 w-full ">
			{#if $delayed}
				<Loader2 class="size-6 animate-spin" />
			{:else}
				Register
			{/if}
		</Form.Button>

		<div class="my-6 flex items-center">
			<div class="flex-grow border-t border-gray-300"></div>
			<div class="mx-4 text-gray-500">OR</div>
			<div class="border-gray-30 flex-grow border-t"></div>
		</div>

		<Form.Button variant="secondary" class="w-full" href="/login">Login</Form.Button>
	</form>
</div>
