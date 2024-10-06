import { Router } from 'express'
import {
  createProduct,
  getProductsInvoice
} from '../controllers/product.controller'

const router = Router()

router.post('/create', async (req, res) => {
  return res.json(await createProduct(req.body))
})

router.get('/', async (_req, res) => {
  return res.json(await getProductsInvoice())
})

export default router
