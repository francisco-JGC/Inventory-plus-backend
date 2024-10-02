import { Router } from 'express'
import { createProduct } from '../controllers/product.controller'

const router = Router()

router.post('/create', async (req, res) => {
  return res.json(await createProduct(req.body))
})

export default router
