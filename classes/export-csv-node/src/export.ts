import { createWriteStream } from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { sql } from './db/client.ts'

const query = sql /*sql*/`
  SELECT id, name
  FROM products
  WHERE price_in_cents >= 1000
`

const cursor = query.cursor(10)

const exampleStream = new Transform({
  objectMode: true,
  transform(chunk, _, callback) {
    for (const item of chunk) {
      this.push(item)
    }

    callback()
  },
})

await pipeline(
  cursor,
  exampleStream,
  stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
    ],
  }),
  createWriteStream('./export.csv', 'utf-8')
)

await sql.end()
