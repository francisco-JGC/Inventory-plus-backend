import { Router } from 'express'
import {
  getAllProviders,
  createProvider,
  getPaginationProvider,
  deleteProviderById,
  getProviderById,
  updateProviderById
} from '../controllers/provider.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'seller', 'inventory']),
  async (_req, res) => {
    return res.json(await getAllProviders())
  }
)

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await createProvider(req.body))
  }
)

router.get(
  '/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin', 'seller', 'inventory']),
  async (req, res) => {
    const { page, limit, filter } = req.params

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    return res.json(
      await getPaginationProvider({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

router.post(
  '/delete',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    res.json(await deleteProviderById(req.body.id))
  }
)

router.get(
  '/:id',
  isAuth,
  authorizeRoles(['admin', 'seller', 'inventory']),
  async (req, res) => {
    res.json(await getProviderById(Number(req.params.id)))
  }
)

router.post(
  '/update/:id',
  authorizeRoles(['admin', 'inventory']),
  isAuth,
  async (req, res) => {
    res.json(await updateProviderById(req.body, Number(req.params.id)))
  }
)

export default router
