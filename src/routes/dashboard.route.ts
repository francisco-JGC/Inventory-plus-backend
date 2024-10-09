import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getMonthlySalesInformation } from '../controllers/dashboard.controller'

const router = Router()

router.get('/monthly-sales-details', isAuth, async (_req, res) => {
  res.json(await getMonthlySalesInformation())
})

export default router
