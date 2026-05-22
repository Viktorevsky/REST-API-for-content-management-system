import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma'
import { createPostSchema } from '../schemas/posts.schema'
import authenticate from '../hooks/authenticate'

export default async function(app: FastifyInstance){
app.get('/posts', async (request, reply) => {
  return await prisma.post.findMany({
    include: {
      author:   { select: { id: true, username: true } },
      category: { select: { id: true, name: true } }
    }
  })
})

app.post('/posts', {preHandler: authenticate}, async (request, reply) => {
  const authorId = request.user.id  
  const { title, content, categoryId } = createPostSchema.parse(request.body)
  const newPost = await prisma.post.create({data: { title, content, authorId ,categoryId}})
  return reply.status(201).send(newPost)
})
}
