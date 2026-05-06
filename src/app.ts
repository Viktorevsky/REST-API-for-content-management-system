import Fastify from 'fastify'
import './routes/posts'
import './routes/users'

const app = Fastify({logger: true})

app.get('/', async (request, reply) => {
    
  return { status: 'ok' }
})

export default app