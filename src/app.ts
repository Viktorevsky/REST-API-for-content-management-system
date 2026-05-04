import Fastify from 'fastify'

const app = Fastify({logger: true})

app.get('/', async (request, reply) => {
    
  return { status: 'ok' }
})


app.listen({ port: 3000 }, (err) => {
  if (err) process.exit(1)
  console.log('Server running on port 3000')
})

export default app