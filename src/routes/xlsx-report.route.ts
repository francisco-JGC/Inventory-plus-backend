import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
  downloadInventoryReport,
  downloadProvidersReport,
  downloadSalesReport
} from '../controllers/xlsxReport.controller'

const router = Router()

router.get(
  '/sales-report',
  isAuth,
  authorizeRoles(['admin']),
  downloadSalesReport
)

router.get(
  '/providers-report',
  isAuth,
  authorizeRoles(['admin']),
  downloadProvidersReport
)

router.get(
  '/inventory-report',
  isAuth,
  authorizeRoles(['admin']),
  downloadInventoryReport
)

export default router
