import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await pool.query(text, params)
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 }
}
