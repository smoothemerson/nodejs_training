import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, email, password } = createUsersBodySchema.parse(request.body)

    const checkIfEmailAlreadyExists = await knex('users')
      .where('email', email)
      .first()

    if (checkIfEmailAlreadyExists) {
      return reply.status(409).send({
        message: 'Email already exists',
      })
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      user_id: randomUUID(),
      name,
      email,
      password,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const totalMealsByUser = await knex('meals')
        .count()
        .where('session_id', sessionId)
        .first()

      if (!totalMealsByUser || totalMealsByUser['count(*)'] === undefined) {
        return reply.status(400).send({
          message: 'No meals',
        })
      }

      const totalOfMealsInsideTheDiet = await knex('meals')
        .count()
        .where({
          session_id: sessionId,
          is_in_or_out_of_diet: true,
        })
        .first()

      if (
        !totalOfMealsInsideTheDiet ||
        totalOfMealsInsideTheDiet['count(*)'] === undefined
      ) {
        return reply.status(400).send({
          message: 'No meals inside the diet',
        })
      }

      const totalOfMealsOutsideTheDiet = await knex('meals')
        .count()
        .where({
          session_id: sessionId,
          is_in_or_out_of_diet: false,
        })
        .first()

      if (
        !totalOfMealsOutsideTheDiet ||
        totalOfMealsOutsideTheDiet['count(*)'] === undefined
      ) {
        return reply.status(400).send({
          message: 'No meals outside the diet',
        })
      }

      const meals = await knex('meals')
        .select('is_in_or_out_of_diet')
        .where('session_id', sessionId)
        .orderBy('created_at', 'asc')

      let bestSequence = 0
      let currentSequence = 0

      for (const meal of meals) {
        if (meal.is_in_or_out_of_diet) {
          currentSequence++
          if (currentSequence > bestSequence) {
            bestSequence = currentSequence
          }
        } else {
          currentSequence = 0
        }
      }

      return reply.send({
        totalOfMeals: totalMealsByUser['count(*)'],
        totalOfMealsInsideTheDiet: totalOfMealsInsideTheDiet['count(*)'],
        totalOfMealsOutsideTheDiet: totalOfMealsOutsideTheDiet['count(*)'],
        bestSequenceOfMealsInsideTheDiet: bestSequence,
      })
    },
  )
}
