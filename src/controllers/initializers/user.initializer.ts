import { User } from '../../entities/user/user.entity'
import { AppDataSource } from '../../config/database.config'
import { getRoleByName } from '../role.controller'
import { createUser } from '../user.controller'
import { handleError, handleSuccess } from '../types'

export const createDefaultUsers = async () => {
  try {
    const defaultUsers = [
      {
        email: 'admin@admin.com',
        password: '12345678',
        username: 'admin',
        rolename: 'admin'
      }
    ]

    for (const user of defaultUsers) {
      const userExist = await AppDataSource.getRepository(User).findOne({
        where: { email: user.email }
      })

      if (!userExist) {
        const role = await getRoleByName(user.rolename)

        if (role.success) {
          createUser
        }
      }
    }

    return handleSuccess({})
  } catch (error: any) {
    console.error({ error })
    return handleError(error.message)
  }
}
