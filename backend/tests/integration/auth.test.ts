import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

describe('Auth middleware — /profile', () => {
  it('returns 401 on GET without a token', async () => {
    const res = await request(app).get('/profile')
    expect(res.status).toBe(401)
  })

  it('returns 401 on POST without a token', async () => {
    const res = await request(app).post('/profile').send({ name: 'test' })
    expect(res.status).toBe(401)
  })

  it('returns 401 on GET with a malformed token', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer not-a-real-jwt')
    expect(res.status).toBe(401)
  })
})

describe('Auth middleware — /gyms POST routes', () => {
  it('returns 401 on POST /gyms without a token', async () => {
    const res = await request(app).post('/gyms').send({ name: 'Test Gym' })
    expect(res.status).toBe(401)
  })

  it('returns 401 on POST /gyms/:id/reviews without a token', async () => {
    const res = await request(app).post('/gyms/123/reviews').send({ rating: 5 })
    expect(res.status).toBe(401)
  })

  it('allows GET /gyms without a token', async () => {
    const res = await request(app).get('/gyms')
    expect(res.status).not.toBe(401)
  })
})
