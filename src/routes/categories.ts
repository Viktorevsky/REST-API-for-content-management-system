import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import authenticate from '../hooks/authenticate'
import { createCategorySchema,updateCategorySchema } from '../schemas/category.schema'
import slugify from 'slugify'
import adminAuth from '../hooks/adminAuth'


export default async function categories(app: FastifyInstance) {
    app.get('/categories', async (request, reply) => {
        return await prisma.category.findMany()
    })

    app.get('/categories/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const category = await prisma.category.findUnique({ 
            where: { id: Number(id) },
            include: { posts: { select: { id: true, title: true } } }
    })
        if (!category) {
            return reply.status(404).send({ error: 'category not found' })
        }
        return category
    })

    app.post('/categories', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {
        const { name } = createCategorySchema.parse(request.body)
        const slug = slugify(name, { lower: true, strict: true })
        const newcategory = await prisma.category.create({ data: { name, slug } })
        return reply.status(201).send(newcategory)
    })

    app.delete('/categories/:id', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const category = await prisma.category.findUnique({ where: { id:Number(id) } })
        if(!category) {
            return reply.status(404).send({ error: 'category not found' })
        }
        await prisma.category.delete({ where: { id:Number(id) } })
        return reply.status(204).send()
    })  

    app.put('/categories/:id', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {

  const { id } = request.params as { id: string }
  const category = await prisma.category.findUnique({ where: { id: Number(id) } })
  if (!category) {
    return reply.status(404).send({ error: 'category not found' })
  }

  const { name } = updateCategorySchema.parse(request.body)

  const updatedcategory = await prisma.category.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name, slug: slugify(name, { lower: true, strict: true }) })
    }
  })

  return reply.send(updatedcategory)
})
}