import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/categories' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.int(),
    description: z.string().optional(),
  }),
});

const paintings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/paintings' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: reference('categories'),
      image: image(),
      dimensions: z.string(),
      technique: z.enum([
        'acrylique',
        'huile',
        'technique mixte',
        'mixte',
        'pastel',
      ]),
      year: z.int().optional(),
      description: z.string().optional(),
      order: z.int().default(0),
      available: z.boolean().default(true),
      note: z.string().optional(),
    }),
});

const expositions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/expositions' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      image: image().optional(),
      description: z.string().optional(),
    }),
});

const siteSettings = defineCollection({
  loader: file('src/content/siteSettings/settings.yaml'),
  schema: ({ image }) =>
    z.object({
      bioParagraphs: z.array(z.string()),
      artistPhoto: image(),
      heroHighlight: z.object({
        text: z.string(),
        link: z.string().optional(),
      }),
      contactEmail: z.string(),
      contactPhone: z.string(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
        ogImage: image(),
      }),
      analyticsId: z.string().optional(),
    }),
});

export const collections = { categories, paintings, expositions, siteSettings };
