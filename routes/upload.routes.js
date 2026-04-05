import { Router } from 'express'
import upload from '../middlewares/upload.js'
import { uploadImage } from '../controllers/upload.controllers.js'

const router = Router()

router.post('/', upload.single('image'), uploadImage)

export default router