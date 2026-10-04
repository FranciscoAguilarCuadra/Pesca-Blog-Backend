# Pesca Blog — Backend

> API REST del blog de pesca: autenticación, gestión de publicaciones e imágenes.
> Backend de [Pesca-Blog](https://github.com/FranciscoAguilarCuadra/Pesca-Blog) (frontend React).

[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

---

## Qué es

Backend en **Express (Node.js)** con arquitectura **MVC** que expone la API consumida por el frontend Pesca Blog:

- **Autenticación** con JWT y contraseñas hasheadas con **bcrypt**.
- **CRUD de publicaciones** (posts) con rutas y controladores dedicados.
- **Subida de imágenes** con **multer** + almacenamiento en **Cloudinary**.
- **Base de datos PostgreSQL** (esquema en `db/`).

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js ≥ 18 (ESM) |
| Framework | Express 5 |
| Base de datos | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` |
| Imágenes | multer + Cloudinary |
| Seguridad | Helmet, express-rate-limit (límite en `/auth`), CORS restringido |
| Desarrollo | nodemon, logger propio (`utils/logger.js`) |

## Estructura

```
Pesca-Blog-Backend/
├── config/         # Configuración (pool de base de datos, etc.)
├── controllers/    # Lógica de cada recurso
├── routes/         # Rutas: posts, auth, upload
├── middlewares/    # Validación de token, manejo de errores
├── db/             # Esquema y conexión a PostgreSQL
├── utils/          # Logger y utilidades
├── hash.js         # Utilidad para generar hashes con bcrypt
├── app.js          # Punto de entrada (valida .env, monta middleware)
└── DEPLOYMENT.md   # Guía de despliegue a producción
```

## Correr el proyecto en local

```bash
git clone https://github.com/FranciscoAguilarCuadra/Pesca-Blog-Backend.git
cd Pesca-Blog-Backend
npm install

# 2. Variables de entorno
cp .env.example .env
# Completar: credenciales de PostgreSQL, JWT_SECRET y Cloudinary

# 3. Base de datos
createdb pesca_blog
# cargar el esquema desde db/

# 4. Desarrollo (nodemon) y producción
npm run dev
npm start
```

El servidor valida las variables de entorno obligatorias al arrancar y falla con un mensaje claro si falta alguna.

## Despliegue

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para la guía completa de producción.

## Repos relacionados

- **Frontend:** [Pesca-Blog](https://github.com/FranciscoAguilarCuadra/Pesca-Blog) — React + Vite, en producción en [pesca-blog.vercel.app](https://pesca-blog.vercel.app)

## Autor

**Francisco Aguilar Cuadra** — Ingeniero Civil Informático
[GitHub](https://github.com/FranciscoAguilarCuadra) · [LinkedIn](https://linkedin.com/in/francisco-aguilar-cuadra)
