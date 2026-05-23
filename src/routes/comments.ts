import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import authenticate from '../hooks/authenticate'

export default async function(app: FastifyInstance) {
  app.get('/comments', async (request, reply) => {
    return await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
  })

  app.post('/comments',{preHandler: authenticate}, async (request, reply) => {

    const { text, postId} = request.body as { text:string,postId : number,}
    const userId = request.user.id
    const newComment = await prisma.comment.create({
      data: { text, postId,userId},
    })
    return reply.status(201).send(newComment)
  })

  app.delete('/comments/:id', { preHandler: authenticate }, async (request, reply) => {
    const currentUser = request.user
    const { id } = request.params as { id: string }

    const comment = await prisma.comment.findUnique({ 
        where: { id: Number(id) } 
    })
    if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' })
    }

    if (comment.userId !== currentUser.id && currentUser.role !== 'admin') {
        return reply.status(403).send({ error: 'Forbidden' })
    }

    await prisma.comment.delete({ where: { id: Number(id) } })
    return reply.status(204).send()
})
}
