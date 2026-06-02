import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const ALLOWED = 'http://localhost:5173'
const DISALLOWED = 'https://evil.example.com'

describe('CORS — allowed origin', () => {
  it('echoes the origin on a simple GET request', async () => {
    const res = await request(app).get('/spaces').set('Origin', ALLOWED)
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED)
    expect(res.headers['access-control-allow-credentials']).toBe('true')
  })

  it('responds to a preflight OPTIONS with the configured methods and headers', async () => {
    const res = await request(app)
      .options('/spaces')
      .set('Origin', ALLOWED)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'authorization,content-type')

    expect(res.status).toBe(204)
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED)
    expect(res.headers['access-control-allow-methods']).toContain('POST')
    expect(res.headers['access-control-allow-headers']).toContain('Authorization')
  })
})

describe('CORS — disallowed origin', () => {
  it('does not echo a disallowed origin in the response', async () => {
    const res = await request(app).get('/spaces').set('Origin', DISALLOWED)
    expect(res.headers['access-control-allow-origin']).toBeUndefined()
  })
})
