import { Router } from 'express'
import {
  getAllProviders,
  createProvider
} from '../controllers/provider.controller'

const router = Router()

router.get('/', async (_req, res) => {
  return res.json(await getAllProviders())
})

router.post('/create', async (req, res) => {
  return res.json(await createProvider(req.body))
})

export default router
