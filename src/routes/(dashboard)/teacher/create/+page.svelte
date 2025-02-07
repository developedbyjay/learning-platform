<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';

	export var data:any;
	
	const form = superForm(data.form, {
		validators: zodClient()
	});
</script>

<div class="mx-auto flex h-full max-w-5xl border p-6 md:items-center md:justify-center">
	<div>
		<h1 class="text-2xl">Name Your Course</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			What would you like to name your course? Don't worry, you can change it later
		</p>
		<form action="/teacher/create" method="POST" class="mt-8 space-y-8"></form>
	</div>
</div>
