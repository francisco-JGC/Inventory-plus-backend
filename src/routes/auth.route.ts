import { Router } from 'express'
import { login, register } from '../controllers/auth.controller'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const responseLogin = await login({ email, password })

  return res.json(responseLogin)
})

router.post('/register', register)

export default router
