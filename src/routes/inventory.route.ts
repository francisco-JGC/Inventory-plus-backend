import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getInventoryDetails } from '../controllers/inventory.controller'

const router = Router()

router.get('/details', isAuth, async (_req, res) => {
  res.json(await getInventoryDetails())
})

export default router
