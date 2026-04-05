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
    const { title, content, image_url } = req.body

    if (!title || !content || !image_url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, content, image_url]
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
    const { title, content, image_url } = req.body

    if (!title || !content || !image_url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           image_url = $3
       WHERE id = $4
       RETURNING *`,
      [title, content, image_url, id]
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