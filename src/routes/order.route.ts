import { Router } from 'express'
import {
  changeOrderStatusSale,
  createOrder,
  getPaginationOrders
} from '../controllers/order.controller'
import { isAuth } from '../middlewares/isAuth.middleware'

const router = Router()

router.post('/create', isAuth, async (req, res) => {
  return res.json(await createOrder(req.body))
})

router.get('/change-status/:id', isAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10)

  return res.json(await changeOrderStatusSale(id))
})

router.get('/:page/:limit/:filter?', isAuth, async (req, res) => {
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
})

export default router
