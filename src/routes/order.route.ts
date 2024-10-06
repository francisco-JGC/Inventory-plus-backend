import { Router } from 'express'
import { createOrder } from '../controllers/order.controller'

const router = Router()

router.post('/create', async (req, res) => {
  return res.json(await createOrder(req.body))
})

export default router
