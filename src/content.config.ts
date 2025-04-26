import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published: z.coerce.date(),
      description: z.string(),
      cover: image(),
      coverAlt: z.string(),
      links: z.optional(
        z.array(
          z.object({
            href: z.string(),
            text: z.string(),
            openInNewPage: z.boolean(),
          })
        )
      ),
      icon: z.optional(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("image"),
            src: image(),
          }),
        ])
      ),
    }),
});

export const collections = { projects };
