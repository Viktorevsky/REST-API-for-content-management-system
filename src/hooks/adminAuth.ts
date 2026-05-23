import { FastifyRequest, FastifyReply } from 'fastify'

export default async function adminAuth(request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role !== 'admin') {
    return reply.status(403).send({ error: 'Forbidden' })
  }
}