import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedFile = path.join(__dirname, '..', 'db', 'seed.sql')

const client = new Client({
  connectionString: 'postgresql://postgres:Provomission2022!@localhost:5432/stillwaters',
})

await client.connect()
console.log('Connected to database.')

const sql = await fs.readFile(seedFile, 'utf8')
await client.query(sql)
console.log('Seed complete.')

await client.end()
