import { pool } from '../db/conexion.js'

export const getPosts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener posts:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error al obtener post:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export const createPost = async (req, res) => {
  try {
    const { title, content, image_url, images } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    // Soporte para múltiples imágenes: images array o image_url único
    const imagesArray = images && Array.isArray(images) && images.length > 0
      ? images
      : (image_url ? [image_url] : [])

    if (imagesArray.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos una imagen' })
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, image_url, images)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, imagesArray[0], JSON.stringify(imagesArray)]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error al crear post:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, image_url, images } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    // Soporte para múltiples imágenes
    const imagesArray = images && Array.isArray(images) && images.length > 0
      ? images
      : (image_url ? [image_url] : [])

    if (imagesArray.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos una imagen' })
    }

    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           image_url = $3,
           images = $4
       WHERE id = $5
       RETURNING *`,
      [title, content, imagesArray[0], JSON.stringify(imagesArray), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error al actualizar post:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    res.json({ message: 'Post eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar post:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}