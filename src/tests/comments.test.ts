import { describe, it, expect } from 'vitest'
import app from '../app'
import { registerAndLogin, createCategory } from './helpers'

async function createPost(token: string, categoryId: number) {
  const res = await app.inject({
    method: 'POST',
    url: '/posts',
    headers: { authorization: `Bearer ${token}` },
    payload: { title: 'Test post', content: 'Content', categoryId }
  })
  return res.json()
}

async function createComment(token: string, postId: number) {
  const res = await app.inject({
    method: 'POST',
    url: '/comments',
    headers: { authorization: `Bearer ${token}` },
    payload: { text: 'Test comment', postId }
  })
  return res.json()
}

describe('GET /comments', () => {
  it('should return 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/comments' })
    expect(response.statusCode).toBe(200)
  })
})

describe('POST /comments', () => {
  it('should return 401 without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/comments',
      payload: { text: 'Test comment', postId: 1 }
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 201 with token', async () => {
    const token = await registerAndLogin()
    const category = await createCategory()
    const post = await createPost(token, category.id)

    const response = await app.inject({
      method: 'POST',
      url: '/comments',
      headers: { authorization: `Bearer ${token}` },
      payload: { text: 'Test comment', postId: post.id }
    })
    expect(response.statusCode).toBe(201)
  })
})

describe('DELETE /comments/:id', () => {
  it('should return 204 if own comment', async () => {
    const token = await registerAndLogin()
    const category = await createCategory()
    const post = await createPost(token, category.id)
    const comment = await createComment(token, post.id)

    const response = await app.inject({
      method: 'DELETE',
      url: `/comments/${comment.id}`,
      headers: { authorization: `Bearer ${token}` }
    })
    expect(response.statusCode).toBe(204)
  })

  it('should return 403 if not own comment', async () => {
    const ownerToken = await registerAndLogin('owner@test.com', 'owner')
    const category = await createCategory()
    const post = await createPost(ownerToken, category.id)
    const comment = await createComment(ownerToken, post.id)

    const otherToken = await registerAndLogin('other@test.com', 'other')

    const response = await app.inject({
      method: 'DELETE',
      url: `/comments/${comment.id}`,
      headers: { authorization: `Bearer ${otherToken}` }
    })
    expect(response.statusCode).toBe(403)
  })
})