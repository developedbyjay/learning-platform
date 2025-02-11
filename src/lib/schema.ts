import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const registerSchema = z
	.object({
		firstName: z.string().min(3),
		lastName: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string().min(8)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm']
	});

export const createCourseSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	imageUrl: z.string().optional(),
	price: z.number({ coerce: true }).optional(),
	isPublished: z.boolean(),
	category: z.string().optional()
});

export const titleSchema = createCourseSchema.pick({ title: true });

export const descriptionSchema = createCourseSchema.pick({ description: true });

export const categorySchema = createCourseSchema.pick({ category: true });

export type CourseSchema = z.infer<typeof createCourseSchema>;
