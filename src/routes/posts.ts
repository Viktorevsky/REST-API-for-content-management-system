import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma'

export default async function(app: FastifyInstance){
app.get('/posts', async (request, reply) => {
  return await prisma.post.findMany()
})

app.post('/posts', async (request, reply) => {
  let { title, content,authorId ,categoryId } = request.body as { 
    title?: string; content?: string; authorId?: number; categoryId?: number }
  if(!title || !content || !authorId || !categoryId) {
    return reply.status(400).send({ error: 'All fields are required' })  
  }
  let newPost = await prisma.post.create({data: { title, content, authorId ,categoryId}})
  return reply.status(201).send(newPost)
})
}
