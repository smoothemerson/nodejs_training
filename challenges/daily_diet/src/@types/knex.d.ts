// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      user_id: string
      name: string
      email: string
      password: string
      created_at: string
    }
    meals: {
      meal_id: string
      session_id?: string
      name: string
      description: string
      is_in_or_out_of_diet: boolean
      created_at: string
    }
  }
}
