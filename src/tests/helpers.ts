import prisma from '../lib/prisma'
import app from '../app'

export async function registerAndLogin(
  email = 'test@test.com',
  username = 'testuser',
  role = 'viewer'
) {
  const bcrypt = (await import('bcrypt')).default
  const hashedPassword = await bcrypt.hash('123456', 10)

  await prisma.user.upsert({
    where: { email },
    update: { role },
    create: { username, email, password: hashedPassword, role }
  })

  const loginRes = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password: '123456' }
  })

  return loginRes.json().accessToken
}

export async function createCategory() {
  return await prisma.category.upsert({
    where: { slug: 'backend' },
    update: {},
    create: { name: 'Backend', slug: 'backend' }
  })
}

export async function createTag() {
  return await prisma.tag.upsert({
    where: { slug: 'nodejs' },
    update: {},
    create: { name: 'Node.js', slug: 'nodejs' }
  })
}