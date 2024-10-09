import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import {
  getMonthlySalesInformation,
  getSalesLastSixMonths
} from '../controllers/dashboard.controller'

const router = Router()

router.get('/monthly-sales-details', isAuth, async (_req, res) => {
  res.json(await getMonthlySalesInformation())
})

router.get('/sales-last-six-month', isAuth, async (_req, res) => {
  res.json(await getSalesLastSixMonths())
})

export default router
