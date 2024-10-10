import { Router } from 'express'
import {
  createCategory,
  getCategories
} from '../controllers/category.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (_req, res) => {
    return res.json(await getCategories())
  }
)

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    const { name, description } = req.body

    return res.json(await createCategory({ name, description }))
  }
)

export default router
