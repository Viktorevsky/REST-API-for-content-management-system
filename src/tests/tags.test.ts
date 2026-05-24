import { describe, it, expect } from 'vitest'
import app from '../app'
import { registerAndLogin, createTag } from './helpers'

describe('GET /tags', () => {
  it('should return 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/tags' })
    expect(response.statusCode).toBe(200)
  })
})

describe('POST /tags', () => {
  it('should return 401 without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tags',
      payload: { name: 'Node.js' }
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 403 if not admin', async () => {
    const token = await registerAndLogin('viewer@test.com', 'viewer', 'viewer')
    const response = await app.inject({
      method: 'POST',
      url: '/tags',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Node.js' }
    })
    expect(response.statusCode).toBe(403)
  })

  it('should return 201 if admin', async () => {
    const token = await registerAndLogin('admin@test.com', 'admin', 'admin')
    const response = await app.inject({
      method: 'POST',
      url: '/tags',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Node.js' }
    })
    expect(response.statusCode).toBe(201)
  })
})

describe('GET /tags/:id', () => {
  it('should return 404 if not found', async () => {
    const response = await app.inject({ method: 'GET', url: '/tags/999' })
    expect(response.statusCode).toBe(404)
  })
})

describe('DELETE /tags/:id', () => {
  it('should return 401 without token', async () => {
    const tag = await createTag()
    const response = await app.inject({
      method: 'DELETE',
      url: `/tags/${tag.id}`
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 204 if admin', async () => {
    const token = await registerAndLogin('admin@test.com', 'admin', 'admin')
    const tag = await createTag()
    const response = await app.inject({
      method: 'DELETE',
      url: `/tags/${tag.id}`,
      headers: { authorization: `Bearer ${token}` }
    })
    expect(response.statusCode).toBe(204)
  })
})

describe('PUT /tags/:id', () => {
  it('should return 200 if admin', async () => {
    const token = await registerAndLogin('admin@test.com', 'admin', 'admin')
    const tag = await createTag()
    const response = await app.inject({
      method: 'PUT',
      url: `/tags/${tag.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'TypeScript' }
    })
    expect(response.statusCode).toBe(200)
  })
})