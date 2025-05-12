import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  const { id } = await prisma.organization.create({
    data: {
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 34567890',
      id: '',
      created_at: new Date(),
    },
  })

  const authResponse = await request(app.server)
    .post('/organizations/sessions')
    .send({
      email: 'johndoe@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return { token, id }
}
