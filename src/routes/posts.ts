import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma'
import { createPostSchema,updatePostSchema } from '../schemas/posts.schema'
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

  app.get('/posts/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const post = await prisma.post.findUnique({ 
      where: { id: Number(id) },
      include: {
        author:   { select: { id: true, username: true } },
        category: { select: { id: true, name: true } },
        tags:     { select: { id: true, name: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, username: true } } } }
      }
    })
    if (!post) {
      return reply.status(404).send({ error: 'Post not found' })
    }
    return post
  })

  app.post('/posts', {preHandler: authenticate}, async (request, reply) => {
    const authorId = request.user.id  
    const { title, content, categoryId } = createPostSchema.parse(request.body)
    const newPost = await prisma.post.create({data: { title, content, authorId ,categoryId}})
    return reply.status(201).send(newPost)
  })

  app.delete('/posts/:id', { preHandler: authenticate }, async (request, reply) => {
    const currentUser = request.user
    const { id } = request.params as { id: string }
    
    const post = await prisma.post.findUnique({ where: { id: Number(id) }})
    
    if (!post) {
      return reply.status(404).send({ error: 'Post not found' })
    }
    
    if(currentUser.role !== 'admin' && post.authorId !== currentUser.id) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    await prisma.post.delete({ where: { id: Number(id) } })
    return reply.status(204).send()
  })

  app.put('/posts/:id', { preHandler: authenticate }, async (request, reply) => {
    const currentUser = request.user
    const { id } = request.params as { id: string }
    
    const post = await prisma.post.findUnique({ where: { id: Number(id) }})
    
    if (!post) {
      return reply.status(404).send({ error: 'Post not found' })
    }
    
    if(currentUser.role !== 'admin' && post.authorId !== currentUser.id) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const { title, content, categoryId, status } = updatePostSchema.parse(request.body)
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { ...(title && { title }),
              ...(content && { content }),
              ...(categoryId && { categoryId }),
              ...(status && { status }) }
        
    })
    return reply.status(200).send(updatedPost)
  })
}
