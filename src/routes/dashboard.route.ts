import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import {
  getMonthlySalesInformation,
  getSalesLastSixMonths,
  getTop7Products
} from '../controllers/dashboard.controller'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/monthly-sales-details',
  isAuth,
  authorizeRoles(['admin']),
  async (_req, res) => {
    res.json(await getMonthlySalesInformation())
  }
)

router.get(
  '/sales-last-six-month',
  isAuth,
  authorizeRoles(['admin']),
  async (_req, res) => {
    res.json(await getSalesLastSixMonths())
  }
)

router.get(
  '/top-products',
  isAuth,
  authorizeRoles(['admin']),
  async (_req, res) => {
    res.json(await getTop7Products())
  }
)

export default router
