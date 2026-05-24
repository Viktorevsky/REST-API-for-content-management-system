import { describe, it, expect} from 'vitest'
import app from '../app'
import { registerAndLogin, createCategory } from './helpers'


describe('GET /posts', () => {
  it('should return 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/posts' })
    expect(response.statusCode).toBe(200)
  })
})

describe('POST /posts', () => {
  it('should return 401 without token', async () => {
    const category = await createCategory()
    const response = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: { title: 'Test', content: 'Content', categoryId: category.id }
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 201 with token', async () => {
    const token = await registerAndLogin()
    const category = await createCategory()
    const response = await app.inject({
      method: 'POST',
      url: '/posts',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Test', content: 'Content', categoryId: category.id }
    })
    expect(response.statusCode).toBe(201)
  })
})

describe('GET /posts/:id', () => {
  it('should return 404 if not found', async () => {
    const response = await app.inject({ method: 'GET', url: '/posts/999' })
    expect(response.statusCode).toBe(404)
  })
})

describe('DELETE /posts/:id', () => {
  it('should return 403 if not author', async () => {
    const category = await createCategory()
    const authorToken = await registerAndLogin('author@test.com', 'author')

    const postRes = await app.inject({
      method: 'POST',
      url: '/posts',
      headers: { authorization: `Bearer ${authorToken}` },
      payload: { title: 'Test', content: 'Content', categoryId: category.id }
    })
    const post = postRes.json()

    const viewerToken = await registerAndLogin('viewer@test.com', 'viewer')

    const response = await app.inject({
      method: 'DELETE',
      url: `/posts/${post.id}`,
      headers: { authorization: `Bearer ${viewerToken}` }
    })
    expect(response.statusCode).toBe(403)
  })

  it('should return 204 if author', async () => {
    const token = await registerAndLogin()
    const category = await createCategory()

    const postRes = await app.inject({
      method: 'POST',
      url: '/posts',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Test', content: 'Content', categoryId: category.id }
    })
    const post = postRes.json()

    const response = await app.inject({
      method: 'DELETE',
      url: `/posts/${post.id}`,
      headers: { authorization: `Bearer ${token}` }
    })
    expect(response.statusCode).toBe(204)
  })
})