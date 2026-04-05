import pg from 'pg'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'

dotenv.config()

const { Pool } = pg

const isProduction = process.env.NODE_ENV === 'production'

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: isProduction ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // ← subido de 2s a 10s para Render
  // SSL obligatorio en Render
  ssl: isProduction ? { rejectUnauthorized: false } : false,
}

export const pool = new Pool(poolConfig)

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de conexiones', err)
})

pool.on('connect', () => {
  logger.debug('Nueva conexión establecida con la BD')
})

pool.on('remove', () => {
  logger.debug('Conexión removida del pool')
})

// Verificar conexión al iniciar
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error(`No se pudo conectar a la base de datos: ${err.message}`)
    logger.error(`Código de error: ${err.code}`)
    logger.error(`Host: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT}, DB: ${process.env.DB_NAME}, User: ${process.env.DB_USER}`)
    logger.error(`SSL activo: ${JSON.stringify(poolConfig.ssl)}`)
    process.exit(1)
  } else {
    logger.info('Conexión a la base de datos exitosa')
  }
})