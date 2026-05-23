import {z} from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  categoryId: z.number().int().positive()
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  categoryId: z.number().optional(),
  status: z.enum(['draft', 'published']).optional(),
})