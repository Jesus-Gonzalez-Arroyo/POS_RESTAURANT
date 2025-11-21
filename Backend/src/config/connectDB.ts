import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Configuración para Railway (DATABASE_URL) o conexión tradicional
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      }
)

pool.on('connect', () => {
  console.log('✅ Connected to the database')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool
