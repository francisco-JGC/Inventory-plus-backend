import { Router } from 'express'
import {
  getAllProviders,
  createProvider,
  getPaginationProvider
} from '../controllers/provider.controller'

const router = Router()

router.get('/', async (_req, res) => {
  return res.json(await getAllProviders())
})

router.post('/create', async (req, res) => {
  return res.json(await createProvider(req.body))
})

router.get('/:page/:limit/:filter?', async (req, res) => {
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
})

export default router
