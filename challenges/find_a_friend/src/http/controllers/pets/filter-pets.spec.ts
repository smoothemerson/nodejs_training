import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/create-and-authenticate-organization'
import { prisma } from '@/lib/prisma'

describe('Filter pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to filter pets', async () => {
    const { token, id } = await createAndAuthenticateOrganization(app)

    await prisma.pet.create({
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
      .get('/pets/filter')
      .set('Authorization', `Bearer ${token}`)
      .query({
        name: 'Luna',
      })

    expect(response.statusCode).toEqual(200)
  })
})
