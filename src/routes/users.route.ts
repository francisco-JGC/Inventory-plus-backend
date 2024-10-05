import { Router } from 'express'
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  updateUserById,
  getPaginationUser,
  getAllUsers
} from '../controllers/user.controller'

const router = Router()

router.get('/', async (_req, res) => {
  return res.json(await getAllUsers())
})

router.post('/create', async (req, res) => {
  return res.json(await createUser(req.body))
})

router.get('/:page/:limit/:filter?', async (req, res) => {
  const { page, limit, filter } = req.params

  const pageNumber = parseInt(page, 10)
  const limitNumber = parseInt(limit, 10)

  return res.json(
    await getPaginationUser({
      page: pageNumber,
      limit: limitNumber,
      filter
    })
  )
})

router.post('/delete', async (req, res) => {
  res.json(await deleteUserById(req.body.id))
})

router.get('/:email', async (req, res) => {
  res.json(await findUserByEmail({ email: req.params.email }))
})

router.post('/update/:id', async (req, res) => {
  res.json(await updateUserById(req.body, Number(req.params.id)))
})

export default router
