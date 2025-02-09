<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { titleSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(titleSchema),
		onUpdated: ({ form }) => {
			if (form.message && !form.valid) {
				toast.error(form.message);
			}
		}
	});

	const { form: formData, enhance, delayed, submitting } = form;
</script>

<div class="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center md:border">
	<div>
		<h1 class="text-2xl">Name Your Course</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			What would you like to name your course? Don't worry, you can change it later
		</p>
		<form action="/teacher/create" method="POST" class="mt-8 space-y-8" use:enhance>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input disabled={$submitting} {...attrs} bind:value={$formData.title} />
				</Form.Control>
				<!-- <Form.Description>What would you teach in the course</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center gap-x-2">
				<Button class="bg-red-200" variant="ghost" href="/">cancel</Button>
				<Form.Button>
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						continue
					{/if}
				</Form.Button>
			</div>
		</form>
	</div>
</div>
