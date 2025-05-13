import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/create-and-authenticate-organization'
import { prisma } from '@/lib/prisma'

describe('Delete pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete pet', async () => {
    const { token, id: organization_id } =
      await createAndAuthenticateOrganization(app)

    const { id } = await prisma.pet.create({
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
        organization_id,
      },
    })

    const response = await request(app.server)
      .delete(`/pets/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })
})
