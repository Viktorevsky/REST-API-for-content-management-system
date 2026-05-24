import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import app from '../app'
import prisma from '../lib/prisma'

async function registerAndLogin(email = 'test@test.com', username = 'testuser', role = 'viewer') {
  const bcrypt = (await import('bcrypt')).default
  const hashedPassword = await bcrypt.hash('123456', 10)

  await prisma.user.create({
    data: { username, email, password: hashedPassword, role }
  })

  const loginRes = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password: '123456' }
  })

  return loginRes.json().accessToken
}

describe('GET /categories', () => {
  it('should return 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/categories' })
    expect(response.statusCode).toBe(200)
  })
})

describe('POST /categories', () => {
  it('should return 401 without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/categories',
      payload: { name: 'Backend' }
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 403 if not admin', async () => {
    const token = await registerAndLogin('viewer@test.com', 'viewer', 'viewer')
    const response = await app.inject({
      method: 'POST',
      url: '/categories',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Backend' }
    })
    expect(response.statusCode).toBe(403)
  })

  it('should return 201 if admin', async () => {
    const token = await registerAndLogin('admin@test.com', 'admin', 'admin')
    const response = await app.inject({
      method: 'POST',
      url: '/categories',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Backend' }
    })
    expect(response.statusCode).toBe(201)
  })
})

describe('GET /categories/:id', () => {
  it('should return 404 if not found', async () => {
    const response = await app.inject({ method: 'GET', url: '/categories/999' })
    expect(response.statusCode).toBe(404)
  })
})