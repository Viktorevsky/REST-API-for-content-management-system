import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import authenticate from '../hooks/authenticate'


type JwtUser = {
  id: number
  email: string
  role: string
}

export default async function(app: FastifyInstance){
  app.get('/users',{preHandler: authenticate}, async (request, reply) => {
    const user = request.user as JwtUser
    if(user.role !== 'admin') {
      return reply.status(403).send({ error: 'Forbidden' })
    }   
   return await prisma.user.findMany({
    select: {
    id: true,
    username: true,
    email: true,
    role: true,
    createdAt: true
    }
   })
 })
}