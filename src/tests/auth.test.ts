import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import app from '../app'
import prisma from '../lib/prisma'


describe('POST /auth/register', () => {
  it('should register a new user and return token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        username: 'testuser',
        email: 'test@test.com',
        password: '123456'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('accessToken')
  })

  it('should return 409 if user already exists', async () => {
    // Сначала регистрируем
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        username: 'testuser',
        email: 'test@test.com',
        password: '123456'
      }
    })

    // Пробуем снова с тем же email
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        username: 'testuser2',
        email: 'test@test.com',
        password: '123456'
      }
    })

    expect(response.statusCode).toBe(409)
  })
})

describe('POST /auth/login', () => {
  it('should login and return token', async () => {
    // Сначала регистрируем
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        username: 'testuser',
        email: 'test@test.com',
        password: '123456'
      }
    })

    // Потом логинимся
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'test@test.com',
        password: '123456'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('accessToken')
  })

  it('should return 401 with wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'test@test.com',
        password: 'wrongpassword'
      }
    })

    expect(response.statusCode).toBe(401)
  })
})