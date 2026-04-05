# Guía de Deployment - Pesca Blog Backend

## Preparación para Producción

### Variables de Entorno
1. Copia `.env.example` a `.env`
2. Configura todas las variables requeridas:
   - `NODE_ENV=production`
   - `JWT_SECRET` - Genera un secreto fuerte
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `CLOUDINARY_*` - Credenciales de Cloudinary
   - `CLIENT_URL` - URL del frontend

### Instalación e Instalación de Dependencias
```bash
npm install
npm install --production  # Para producción
```

### Ejecutar el Servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

### Mejoras Implementadas para Producción

✅ **Seguridad:**
- Helmet.js para headers HTTP seguros
- Rate limiting en rutas de autenticación
- CORS configurado correctamente
- Validación de variables de entorno

✅ **Rendimiento:**
- Compression de respuestas
- Pool de conexiones optimizado (20 en producción)
- Límites de tamaño en body parser

✅ **Monitoreo:**
- Logger estructurado con timestamps
- Diferenciación entre development y production
- Manejo global de errores

✅ **Confiabilidad:**
- Health check endpoint (`/health`)
- Manejo de errores de conexión a BD
- Rutas 404 controladas

### Recomendaciones Adicionales

#### 1. **PM2 para Gestión de Procesos**
```bash
npm install -g pm2
pm2 start app.js --name "pesca-blog" -i max
pm2 startup
pm2 save
```

#### 2. **HTTPS/SSL**
- Usa un proxy reverso como Nginx
- Configura certificados SSL/TLS
- Redirige HTTP → HTTPS

#### 3. **Monitoreo y Logs**
- Implementa un servicio de logging (Winston, Morgan)
- Usa ELK Stack o similar para análisis de logs
- Configura alertas para errores críticos

#### 4. **Base de Datos**
- Realiza backups automáticos
- Usa SSL para conexiones remotas
- Configura réplicas en producción

#### 5. **Hosting Options**
- **Heroku**: Fácil deployment con `git push`
- **DigitalOcean**: Control total, droplets asequibles
- **AWS**: Escalable, pero más complejo
- **Render**: Similar a Heroku, más moderno

#### 6. **CI/CD**
Configura GitHub Actions, GitLab CI o similar:
```yaml
- Ejecutar tests
- Construir aplicación
- Deploy automático al servidor
```

### Checklist de Deployment

- [ ] Todas las variables de entorno configuradas
- [ ] NODE_ENV=production
- [ ] JWT_SECRET es fuerte (longitud > 32 caracteres)
- [ ] Credenciales de BD verificadas
- [ ] .env NO está en Git (.gitignore configurado)
- [ ] npm install ejecutado sin errores
- [ ] npm start funciona correctamente
- [ ] /health endpoint responde
- [ ] Rate limiting activo
- [ ] CORS configurado para el dominio correcto
- [ ] Logs se generan correctamente
- [ ] Backups de BD programados
- [ ] SSL/HTTPS configurado
- [ ] PM2 o similar en producción
