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

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])
if (missingEnvVars.length > 0) {
  logger.error(`Variables de entorno faltantes: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}

const app = express()

app.use(helmet())
app.use(compression())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde'
})
app.use('/auth', limiter)

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/,
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )
    if (allowed) {
      callback(null, true)
    } else {
      logger.warn(`CORS bloqueado: ${origin}`)
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.get('/', (req, res) => res.json({ message: 'API Pesca Blog v1.0' }))

app.use('/posts', postsRoutes)
app.use('/auth', authRoutes)
app.use('/upload', uploadRoutes)

app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.path}`)
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`)
  res.status(err.statusCode || 500).json({
    error: NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en puerto ${PORT} (${NODE_ENV})`)
})