const isDevelopment = process.env.NODE_ENV === 'development'

const logger = {
  info: (message, data) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] INFO: ${message}`, data || '')
  },
  
  error: (message, error) => {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] ERROR: ${message}`)
    if (error && isDevelopment) {
      console.error(error)
    }
  },
  
  warn: (message, data) => {
    const timestamp = new Date().toISOString()
    console.warn(`[${timestamp}] WARN: ${message}`, data || '')
  },
  
  debug: (message, data) => {
    if (isDevelopment) {
      const timestamp = new Date().toISOString()
      console.debug(`[${timestamp}] DEBUG: ${message}`, data || '')
    }
  }
}

export default logger
