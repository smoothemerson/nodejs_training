import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing database credentials')
}

export const sql = postgres(process.env.DATABASE_URL)
