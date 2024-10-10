import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import { downloadSalesReport } from '../controllers/xlsxReport.controller'

const router = Router()

router.get(
  '/sales-report',
  isAuth,
  authorizeRoles(['admin']),
  downloadSalesReport
)

export default router
