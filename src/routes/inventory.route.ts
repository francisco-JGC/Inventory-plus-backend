import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getInventoryDetails } from '../controllers/inventory.controller'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/details',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (_req, res) => {
    res.json(await getInventoryDetails())
  }
)

export default router
