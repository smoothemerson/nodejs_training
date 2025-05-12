import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create organization (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create organization', async () => {
    const response = await request(app.server).post('/organizations').send({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password: '123456',
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 34567890',
    })

    expect(response.statusCode).toEqual(201)
  })
})
