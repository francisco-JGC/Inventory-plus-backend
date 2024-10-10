import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getAllRoles } from '../controllers/role.controller'

const router = Router()

router.get('/', isAuth, async (_req, res) => {
  res.json(await getAllRoles())
})

export default router
