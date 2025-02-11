import { descriptionSchema, titleSchema, categorySchema } from '$lib/schema.js';
import type { Category, Course } from '$lib/types.js';
import { error, redirect, fail } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { user, pb } }) => {
	const { courseId } = params;
	const userId = user?.id;
	if (!userId) {
		redirect(303, '/');
	}

	async function getCourse() {
		try {
			const course = await pb.collection('courses').getOne<Course>(courseId, {
				expand: 'category,attachments(course),chapters(course)'
			});
			if (course.imageUrl) {
				const imageUrl = pb.files.getUrl(course, course.imageUrl);
				course.imageUrl = imageUrl;
			}

			return course;
		} catch (err) {
			const { status } = err as ClientResponseError;
			if (status === 404) error(404, 'course does not exist');
			// redirect(303,'/')
		}
	}

	async function getCategory() {
		try {
			const category = await pb.collection('categories').getFullList<Category>({
				sort: '-created'
			});
			return category;
		} catch (err) {
			const { status } = err as ClientResponseError;
			if (status === 404) redirect(303, '/');
		}
	}
	const [course, categories] = await Promise.all([getCourse(), getCategory()]);

	const titleForm = await superValidate(course, zod(titleSchema));

	const descriptionForm = await superValidate(course, zod(descriptionSchema));

	const categoryForm = await superValidate(course, zod(categorySchema));

	return {
		course: course as Course,
		categories: categories as Category[],
		titleForm,
		descriptionForm,
		categoryForm
	};
};

export const actions = {
	updateTitle: async (event) => {
		const {
			locals: { pb },
			params: { courseId }
		} = event;

		const form = await superValidate(event, zod(titleSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course title');
		} catch (err) {
			const { message: errorMessage } = err as ClientResponseError;
			return message(form, errorMessage, { status: 400 });
		}
	},
	updateDescription: async (event) => {
		const {
			locals: { pb },
			params: { courseId }
		} = event;

		const form = await superValidate(event, zod(descriptionSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course description');
		} catch (err) {
			const { message: errorMessage } = err as ClientResponseError;
			return message(form, errorMessage, { status: 400 });
		}
	},
	updateImage: async (event) => {
		const {
			locals: { pb },
			params: { courseId },
			request
		} = event;

		const formData = await request.formData();
		const image = formData.get('image');

		if (image instanceof File) {
			try {
				await pb.collection('courses').update(courseId, { imageUrl: image });
				return { message: 'successfully updated course image' };
			} catch (err) {
				const { message: errorMessage } = err as ClientResponseError;
				return fail(400, { message: errorMessage });
			}
		}
	},
	updateCategory: async (event) => {
		const {
			locals: { pb },
			params: { courseId }
		} = event;

		const form = await superValidate(event, zod(categorySchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('courses').update(courseId, form.data);

			return message(form, 'successfully updated course category');
		} catch (err) {
			const { message: errorMessage } = err as ClientResponseError;
			return message(form, errorMessage, { status: 400 });
		}
	}

};
