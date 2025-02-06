import { registerSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
};

export const actions = {
	default: async (event) => {
		const {
			locals: { pb }
		} = event;

		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			await pb.collection('users').create(form.data);
		} catch (err) {
			const { status } = err as ClientResponseError;
			return message(form, {
				message: status === 409 ? 'Email already in use' : 'An error occurred'
			});
		}
		redirect(303, '/login');
	}
};
