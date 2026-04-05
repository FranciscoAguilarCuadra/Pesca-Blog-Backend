import pg from 'pg'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'

dotenv.config()

const { Pool } = pg

// Configuración del pool según el entorno
const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Configuración de producción
  max: process.env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

export const pool = new Pool(poolConfig)

// Manejo de errores del pool
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
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('No se pudo conectar a la base de datos', err)
    process.exit(1)
  } else {
    logger.info('Conexión a la base de datos exitosa')
  }
})