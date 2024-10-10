import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
  generateBackupDB,
  restoreBackupDB
} from '../controllers/ddbb.controller'

const router = Router()

router.get('/backup', isAuth, authorizeRoles(['admin']), async (_req, res) => {
  res.json(await generateBackupDB())
})

router.get(
  '/restore/:file_name',
  isAuth,
  authorizeRoles(['admin']),
  async (req, res) => {
    const file_name = req.params.file_name
    res.json(await restoreBackupDB(file_name))
  }
)
export default router
