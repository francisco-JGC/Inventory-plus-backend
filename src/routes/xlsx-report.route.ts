import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
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

export default router
