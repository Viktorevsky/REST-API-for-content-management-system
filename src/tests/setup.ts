import { beforeEach, afterAll } from 'vitest'
import prisma from '../lib/prisma'

beforeEach(async () => {
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tag.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})