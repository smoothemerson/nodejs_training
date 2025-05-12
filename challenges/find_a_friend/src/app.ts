import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import { petsRoutes } from './http/controllers/pets/routes'
import { organizationRoutes } from './http/controllers/organizations/routes'

export const app = fastify()

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCookie)
app.register(organizationRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
