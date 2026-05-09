import Fastify from 'fastify'
import posts from './routes/posts'
import users from './routes/users'

const app = Fastify({logger: true})

app.get('/', async (request, reply) => {
    
  return { status: 'ok' }
})

app.register(users)
app.register(posts)

export default app