import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate organization', async () => {
    await request(app.server).post('/organizations').send({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password: '123456',
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 34567890',
    })

    const response = await request(app.server)
      .post('/organizations/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.statusCode).toEqual(200)
  })
})
