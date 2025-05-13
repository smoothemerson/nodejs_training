import type { FastifyInstance } from 'fastify'
import { createPet } from './create-pet'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { deletePet } from './delete-pet'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets/:organizationId', { onRequest: [verifyJWT] }, createPet)
  app.delete('/pets/:id', { onRequest: [verifyJWT] }, deletePet)
}
