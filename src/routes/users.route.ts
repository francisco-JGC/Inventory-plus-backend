import { Router } from 'express'
import { createUser, findUserByEmail } from '../controllers/user.controller'
import { isAuth } from '../middlewares/isAuth.middleware'

const router = Router()

router.post('/', isAuth, async (req, res) => {
  const { username, email, password } = req.body

  const user = await createUser({ username, email, password })

  if (!user.success) {
    return res.status(400).json({
      message: user.message
    })
  } else {
    return res.status(201).json({
      message: 'Usuario creado con éxito',
      data: user.data
    })
  }
})

router.post('/find', isAuth, async (req, res) => {
  const { email } = req.body

  const user = await findUserByEmail({ email })

  if (!user.success) {
    return res.status(404).json({
      message: user.message
    })
  } else {
    return res.status(200).json({
      data: user.data
    })
  }
})

export default router
