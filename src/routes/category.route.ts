import { Router } from 'express'
import {
  createCategory,
  getCategories
} from '../controllers/category.controller'

const router = Router()

router.get('/', async (_req, res) => {
  return res.json(await getCategories())
})

router.post('/create', async (req, res) => {
  const { name, description } = req.body

  return res.json(await createCategory({ name, description }))
})

export default router
