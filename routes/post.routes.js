import { Router } from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/post.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

router.get('/', getPosts)
router.get('/:id', getPostById)

router.post('/', verifyToken, createPost)
router.put('/:id', verifyToken, updatePost)
router.delete('/:id', verifyToken, deletePost)

export default router