import { vi, describe, it, expect } from 'vitest'
import request from 'supertest'

vi.mock('../../src/middleware/authMiddleware', () => ({
  default: (req: any, _res: any, next: () => void) => {
    req.auth = { payload: { sub: 'test-user', aud: 'test-audience' } }
    next()
  },
}))

const { default: app } = await import('../../src/app')

describe('Protected routes — authenticated access', () => {
  it('returns 200 on GET /profile with a valid token', async () => {
    const res = await request(app).get('/profile')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Authenticated profile access')
  })

  it('returns 201 on POST /profile with a valid token', async () => {
    const res = await request(app).post('/profile').send({ name: 'Test User' })
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Profile saved successfully')
  })
})
