<script lang="ts">
	import { LogOut } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div class="ml-auto flex gap-x-2">
	<Button>
		<LogOut />
		Exit
	</Button>

	<Avatar.Root>
		<Avatar.Image src="https://github.com/developedbyjay.png" alt="@developed" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>

	<form action="/?/logout" method="post">
		<Button size="sm" type="submit">Logout</Button>
	</form>
</div>
