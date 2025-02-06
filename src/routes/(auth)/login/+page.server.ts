import { loginSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions = {
	default: async (event) => {
		const {
			locals: { pb }
		} = event;
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			const user = await pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
			console.log(user);
		} catch (err) {
			const { status } = err as ClientResponseError;
			return message(form, {
				message: status === 401 ? 'Invalid email or password' : 'An error occurred'
			});
		}
		redirect(303, '/');
	}
};
