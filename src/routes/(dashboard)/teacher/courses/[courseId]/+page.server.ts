import {
	descriptionSchema,
	titleSchema,
	categorySchema,
	priceSchema,
	chapterTitleSchema,
} from '$lib/schema.js';

import type { Category, Course, Attachment ,Chapter} from '$lib/types.js';
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
			redirect(303, '/');
		}
	}

	async function getAttachments() {
		try {
			const categories = await pb.collection('attachments').getFullList<Attachment>({
				sort: '-created',
				filter: `course = "${courseId}"`
			});
			return categories;
		} catch (e) {
			const { status } = e as ClientResponseError;

			if (status === 404) redirect(308, '/');

			error(400, 'an error occurred');
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
	const [course, categories, attachments] = await Promise.all([
		getCourse(),
		getCategory(),
		getAttachments()
	]);

	const titleForm = await superValidate(course, zod(titleSchema));
	const descriptionForm = await superValidate(course, zod(descriptionSchema));
	const categoryForm = await superValidate(course, zod(categorySchema));
	const priceForm = await superValidate(course, zod(priceSchema));
	const chapterTitleForm = await superValidate(zod(chapterTitleSchema), { id: 'chapterTitleForm' });
	return {
		course: course as Course,
		categories: categories as Category[],
		attachments: attachments as Attachment[],
		titleForm,
		descriptionForm,
		categoryForm,
		priceForm,
		chapterTitleForm
	};
};

// Helper function to handle course updates
async function handleUpdate(
	event,
	schema:
		| typeof titleSchema
		| typeof descriptionSchema
		| typeof categorySchema
		| typeof priceSchema,
	successMessage: string
) {
	const {
		locals: { pb },
		params: { courseId }
	} = event;

	const form = await superValidate(event, zod(schema));

	if (!form.valid) {
		return fail(400, { form });
	}

	try {
		await pb.collection('courses').update(courseId, form.data);
		return message(form, successMessage);
	} catch (err) {
		const { message: errorMessage } = err as ClientResponseError;
		return message(form, errorMessage, { status: 400 });
	}
}

export const actions = {
	updateTitle: async (event) =>
		handleUpdate(event, titleSchema, 'successfully updated course title'),
	updateDescription: async (event) =>
		handleUpdate(event, descriptionSchema, 'successfully updated course description'),
	updateCategory: async (event) =>
		handleUpdate(event, categorySchema, 'successfully updated course category'),
	updatePrice: async (event) => handleUpdate(event, priceSchema, 'successfully updated the price'),
	createChapter: async (event) => {
		const {
			locals: { pb },

			params
		} = event;
		const { courseId } = params;

		const form = await superValidate(event, zod(chapterTitleSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let lastChapter: Chapter | null = null;
		try {
			lastChapter = await pb
				.collection('chapters')
				.getFirstListItem<Chapter>(`course="${courseId}"`, {
					sort: '-position'
				});
		} catch {
			lastChapter = null;
		}

		try {
			const newPosition = lastChapter ? lastChapter.position + 1 : 1;
			await pb.collection('chapters').create({
				title: form.data.title,
				course: courseId,
				position: newPosition
			});
			return message(form, 'successfully added course chapter');
		} catch (e) {
		
			const { message: errorMessage } = e as ClientResponseError;

			return message(form, errorMessage, {
				status: 400
			});
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
	createAttachment: async (event) => {
		const {
			locals: { pb },
			params: { courseId },
			request
		} = event;

		const formData = await request.formData();
		const file = formData.get('attachment');

		if (file instanceof File) {
			try {
				await pb.collection('attachments').create({ course: courseId, name: file.name, url: file });
				return { message: 'successfully updated course attachment' };
			} catch (err) {
				const { message: errorMessage } = err as ClientResponseError;
				return fail(400, { message: errorMessage });
			}
		}
	},
	deleteAttachment: async (event) => {
		const {
			locals: { pb },

			request
		} = event;
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await pb.collection('attachments').delete(id);
		} catch (err) {
			const { message: errorMessage } = err as ClientResponseError;
			return fail(400, {
				message: errorMessage
			});
		}
	}
};
