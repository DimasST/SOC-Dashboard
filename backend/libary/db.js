import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'soc-dashboard',
  password: '13210909s',
  port: 5432,
})

export default pool
