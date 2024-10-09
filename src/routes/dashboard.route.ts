import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import {
  getMonthlySalesInformation,
  getSalesLastSixMonths,
  getTop7Products
} from '../controllers/dashboard.controller'

const router = Router()

router.get('/monthly-sales-details', isAuth, async (_req, res) => {
  res.json(await getMonthlySalesInformation())
})

router.get('/sales-last-six-month', isAuth, async (_req, res) => {
  res.json(await getSalesLastSixMonths())
})

router.get('/top-products', isAuth, async (_req, res) => {
  res.json(await getTop7Products())
})

export default router
