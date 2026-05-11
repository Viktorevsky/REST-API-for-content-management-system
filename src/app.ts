import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import posts from './routes/posts'
import users from './routes/users'
import auth from './routes/auth'
import authenticate from './hooks/authenticate'
const app = Fastify({logger: true})

app.register(jwt, {
  secret: process.env.JWT_SECRET!
})



app.get('/', async (request, reply) => {
  return { status: 'ok' }
})

app.register(users)
app.register(posts)
app.register(auth)
export default app