import { Router } from 'express'
import {
  createProduct,
  getPaginationProduct,
  getProductsInvoice
} from '../controllers/product.controller'
import { isAuth } from '../middlewares/isAuth.middleware'

const router = Router()

router.post('/create', isAuth, async (req, res) => {
  return res.json(await createProduct(req.body))
})

router.get('/', isAuth, async (_req, res) => {
  return res.json(await getProductsInvoice())
})

router.get('/:page/:limit/:filter?', isAuth, async (req, res) => {
  const { page, limit, filter } = req.params

  const pageNumber = parseInt(page, 10)
  const limitNumber = parseInt(limit, 10)

  return res.json(
    await getPaginationProduct({
      page: pageNumber,
      limit: limitNumber,
      filter
    })
  )
})
export default router
