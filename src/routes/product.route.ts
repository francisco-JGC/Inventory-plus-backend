import { Router } from 'express'
import {
  createProduct,
  deleteProductById,
  getPaginationProduct,
  getProductsInvoice,
  replenishStock,
  updateProductById
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

router.get('/delete/:id', isAuth, async (req, res) => {
  const { id } = req.params
  const productId = parseInt(id, 10)

  const result = await deleteProductById(productId)
  return res.json(result)
})

router.post('/replenish-stock/:id', isAuth, async (req, res) => {
  const { id } = req.params
  const { amount } = req.body
  const productId = parseInt(id, 10)

  if (!amount || isNaN(amount)) {
    return res
      .status(400)
      .json({ error: 'La cantidad es requerida y debe ser un número' })
  }

  const result = await replenishStock(productId, parseInt(amount, 10))
  return res.json(result)
})

router.post('/update/:id', isAuth, async (req, res) => {
  const { id } = req.params
  const productId = parseInt(id, 10)
  const productData = req.body

  const result = await updateProductById(productData, productId)
  return res.json(result)
})
export default router
