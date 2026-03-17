import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

type Queryable = Pick<Pool, 'query'>

async function runQuery<T = unknown>(
  client: Queryable,
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await client.query(text, params)
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 }
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  return runQuery<T>(pool, text, params)
}

export async function withTransaction<T>(
  callback: (client: Queryable) => Promise<T>
): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
