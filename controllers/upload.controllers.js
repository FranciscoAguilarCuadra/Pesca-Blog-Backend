import cloudinary from '../config/cloudinary.js'

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ninguna imagen' })
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'pesca-blog'
    })

    return res.json({
      url: result.secure_url
    })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return res.status(500).json({ message: 'Error al subir la imagen' })
  }
}