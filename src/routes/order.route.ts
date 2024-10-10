import { Router } from 'express'
import {
  changeOrderStatusSale,
  createOrder,
  getInvoiceDetailsById,
  getPaginationOrders
} from '../controllers/order.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'seller']),
  async (req, res) => {
    return res.json(await createOrder(req.body))
  }
)

router.get(
  '/change-status/:id',
  isAuth,
  authorizeRoles(['admin', 'seller']),
  async (req, res) => {
    const id = parseInt(req.params.id, 10)

    return res.json(await changeOrderStatusSale(id))
  }
)

router.get(
  '/invoice-details/:id',
  isAuth,
  authorizeRoles(['admin', 'seller']),
  async (req, res) => {
    const id = parseInt(req.params.id, 10)

    return res.json(await getInvoiceDetailsById(id))
  }
)

router.get(
  '/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin', 'seller']),
  async (req, res) => {
    const { page, limit, filter } = req.params

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    return res.json(
      await getPaginationOrders({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

export default router
