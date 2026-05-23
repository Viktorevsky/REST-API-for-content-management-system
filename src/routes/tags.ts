import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import authenticate from '../hooks/authenticate'
import { createTagSchema,updateTagSchema } from '../schemas/tags.schema'
import slugify from 'slugify'
import adminAuth from '../hooks/adminAuth'


export default async function tags(app: FastifyInstance) {
    app.get('/tags', async (request, reply) => {
        return await prisma.tag.findMany()
    })

    app.get('/tags/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const tag = await prisma.tag.findUnique({ 
        where: { id: Number(id) },
        include: { posts: { select: { id: true, title: true } } }
    })
    if (!tag) {
        return reply.status(404).send({ error: 'tag not found' })
    }
    return tag
})

    app.post('/tags', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {
        const { name } = createTagSchema.parse(request.body)
        const slug = slugify(name, { lower: true, strict: true })
        const newtag = await prisma.tag.create({ data: { name, slug } })
        return reply.status(201).send(newtag)
    })

    app.delete('/tags/:id', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {

        const { id } = request.params as { id: string }
        const tag = await prisma.tag.findUnique({ where: { id:Number(id) } })
        if(!tag) {
            return reply.status(404).send({ error: 'tag not found' })
        }
        await prisma.tag.delete({ where: { id:Number(id) } })
        return reply.status(204).send()
    })  

    app.put('/tags/:id', { preHandler: [authenticate, adminAuth] }, async (request, reply) => {
  
    const { id } = request.params as { id: string }
    const tag = await prisma.tag.findUnique({ where: { id: Number(id) } })
    if (!tag) {
    return reply.status(404).send({ error: 'tag not found' })
    }
    

    const { name } = updateTagSchema.parse(request.body)
    
    const updatedtag = await prisma.tag.update({
     where: { id: Number(id) },
     data: {
       ...(name && { name, slug: slugify(name, { lower: true, strict: true }) })
     }
    })

    return reply.send(updatedtag)
    })
}