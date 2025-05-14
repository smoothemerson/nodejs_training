import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/create-and-authenticate-organization'
import { prisma } from '@/lib/prisma'

describe('Fetch Pets By City (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets by city', async () => {
    const { token, id } = await createAndAuthenticateOrganization(app)

    const { city } = await prisma.pet.create({
      data: {
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
        organization_id: id,
      },
    })

    const response = await request(app.server)
      .get(`/pets/city/${city}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })
})
