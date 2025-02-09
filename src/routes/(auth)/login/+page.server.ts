import { loginSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

interface Login {
	email: string;
	password: string;
}

const login: Login = {
	email: 'okegbemijoshua7@gmail.com',
	password: 'developed@1'
};

export const load = async () => {
	return {
		form: await superValidate(login, zod(loginSchema))
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
			await pb.collection('users').authWithPassword(form.data.email, form.data.password);
		} catch (err) {
			const { status } = err as ClientResponseError;
			return message(form, {
				message: status === 401 ? 'Invalid email or password' : 'An error occurred'
			});
		}
		redirect(303, '/');
	}
};
