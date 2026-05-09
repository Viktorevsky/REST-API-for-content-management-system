import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'

export default async function(app: FastifyInstance){
  app.get('/users', async (request, reply) => {
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

app.post('/users', async (request, reply) => {
  const { username, email, password } = request.body as { 
    username?: string
    email?: string  
    password?: string
  }

  if(!username || !email || !password) {
  return reply.status(400).send({ error: 'All fields are required' })
}
let hashedPassword = await bcrypt.hash(password, 10)
const newUser = await prisma.user.create({
  data: { username, email, password: hashedPassword }
})

return reply.status(201).send(newUser)
})
}