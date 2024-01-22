import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		isPost: z.boolean(),
		colSize: z.number().optional(),
		rowSize: z.number().optional(),
		scrollHero: z.boolean().optional(),
		type: z.string(),
	}),
});

export const collections = { projects };
