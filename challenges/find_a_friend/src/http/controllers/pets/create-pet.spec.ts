import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/create-and-authenticate-organization'

describe('Create pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create pet', async () => {
    const { token, id } = await createAndAuthenticateOrganization(app)

    const response = await request(app.server)
      .post(`/pets/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        state: 'MG',
        city: 'Belo Horizonte',
        neighborhood: 'Santa Efigênia',
        road: 'Avenida Brasil',
        phone: '31987654321',
        name: 'Luna',
        description: 'Luna é uma gata dócil e carinhosa',
        age: 2,
        size: 'SMALL',
        energy_level: 'LOW',
        independence: 'HIGH',
        environment: 'OPEN',
      })

    expect(response.statusCode).toEqual(201)
  })
})
