import { Router } from 'express'
import { createCategory } from '../controllers/category.controller'

const router = Router()

router.post('/create', async (req, res) => {
  const { name, description } = req.body

  return res.json(await createCategory({ name, description }))
})

export default router
