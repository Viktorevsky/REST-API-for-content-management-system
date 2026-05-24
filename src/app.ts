import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import posts from './routes/posts'
import users from './routes/users'
import auth from './routes/auth'
import categories from './routes/categories'
import comments from './routes/comments'
import tags from './routes/tags'
import { FastifyError } from 'fastify'
import { ZodError } from 'zod'

const app = Fastify({ logger: true })

app.register(swagger, {
  openapi: {
    info: {
      title: 'CMS API',
      description: 'REST API для системы управления контентом',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})

app.register(swaggerUi, {
  routePrefix: '/docs'
})

app.register(jwt, {
  secret: process.env.JWT_SECRET!
})


app.setErrorHandler((error: FastifyError, request, reply) => {
  console.error('ERROR:', error.message, error.stack)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.issues
    })
  }

  if (error.statusCode) {
    return reply.status(error.statusCode).send({ error: error.message })
  }

  reply.status(500).send({ error: 'Internal Server Error' })
})

app.get('/', async (request, reply) => {
  return { status: 'ok' }
})

app.register(users)
app.register(posts)
app.register(auth)
app.register(categories)
app.register(comments)
app.register(tags)

export default app