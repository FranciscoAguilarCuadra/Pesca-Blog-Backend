import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import logger from './utils/logger.js'
import postsRoutes from './routes/post.routes.js'
import authRoutes from './routes/auth.routes.js'
import uploadRoutes from './routes/upload.routes.js'

dotenv.config()

// Validar variables de entorno
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
if (missingEnvVars.length > 0) {
  logger.error(`Variables de entorno faltantes: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}

const app = express()

// Middleware de seguridad
app.use(helmet())

// Middleware de compresión
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde'
})
app.use('/auth', limiter) // Aplicar rate limiting más estricto en auth

// CORS configurado para producción
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'API Pesca Blog - v1.0' })
})
app.use('/posts', postsRoutes)
app.use('/auth', authRoutes)
app.use('/upload', uploadRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.path}`)
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  })
})

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, err)
  
  const statusCode = err.statusCode || 500
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en puerto ${PORT} (${NODE_ENV})`)
})