import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isInOrOutOfDiet: z.boolean(),
      })

      const { name, description, isInOrOutOfDiet } =
        createMealsBodySchema.parse(request.body)

      const checkIfNameExists = await knex('meals').where('name', name).first()

      if (checkIfNameExists) {
        return reply.status(409).send({
          message: 'This meal already exists',
        })
      }

      const sessionId = request.cookies.sessionId

      await knex('meals').insert({
        meal_id: randomUUID(),
        session_id: sessionId,
        name,
        description,
        is_in_or_out_of_diet: isInOrOutOfDiet,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const updateMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isInOrOutOfDiet: z.boolean(),
      })

      const { name, description, isInOrOutOfDiet } =
        updateMealsBodySchema.parse(request.body)

      const updateMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = updateMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where('meal_id', mealId)
        .andWhere('session_id', sessionId)
        .first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      await knex('meals')
        .where({
          meal_id: mealId,
          session_id: sessionId,
        })
        .update({
          name,
          description,
          is_in_or_out_of_diet: isInOrOutOfDiet,
        })
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals').select().where('session_id', sessionId)

      return { meals }
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where({
          meal_id: mealId,
          session_id: sessionId,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      return meal
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = deleteMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where('meal_id', mealId)
        .andWhere('session_id', sessionId)
        .first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      await knex('meals')
        .where({
          meal_id: mealId,
          session_id: sessionId,
        })
        .delete()

      reply.status(204).send()
    },
  )
}
