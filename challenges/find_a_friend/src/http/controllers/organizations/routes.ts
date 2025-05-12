import type { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { create } from './create'

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organizations', create)
  app.post('/organizations/sessions', authenticate)
}
