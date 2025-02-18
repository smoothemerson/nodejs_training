import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('meal_id').primary()
    table.uuid('session_id').index()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('is_in_or_out_of_diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
