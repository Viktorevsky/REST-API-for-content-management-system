import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import posts from './routes/posts'
import users from './routes/users'
import auth from './routes/auth'
import { ZodError } from 'zod'

const app = Fastify({logger: true})

app.register(jwt, {
  secret: process.env.JWT_SECRET!
})


app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ 
      error: 'Validation error',
      details: error.issues
    })
  }
  reply.status(500).send({ error: 'Internal Server Error' })
})

app.get('/', async (request, reply) => {
  return { status: 'ok' }
})

app.register(users)
app.register(posts)
app.register(auth)
export default app