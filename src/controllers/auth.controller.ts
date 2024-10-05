import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { User } from '../entities/user/user.entity'
import { AppDataSource } from '../config/database.config'
import { createUser } from './user.controller'
import type {
  ICreateUser,
  ILogin,
  ILoginResponse
} from '../entities/user/types'
import type { IHandleResponseController } from './types'

export const login = async ({
  email,
  password
}: ILogin): Promise<IHandleResponseController<ILoginResponse>> => {
  if (!email || !password) {
    return {
      message: 'Todos los campos son requeridos',
      success: false
    }
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
      relations: ['roles']
    })

    if (!user) {
      return {
        message: 'Verifica tus credenciales',
        success: false
      }
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return {
        message: 'Verifica tus credenciales',
        success: false
      }
    }

    const token = sign(
      { id: user.id, role: user?.roles[0]?.name || '' },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d'
      }
    )

    return {
      data: {
        token,
        username: user.username,
        email: user.email,
        role: user?.roles[0]?.name || ''
      },
      success: true
    }
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}

export const register = async ({
  username,
  email,
  password
}: ICreateUser): Promise<IHandleResponseController<ILoginResponse>> => {
  const user = await createUser({ username, email, password })

  if (!user.success) {
    return {
      message: user.message,
      success: false
    }
  }

  const loginResponse = await login({ email, password })

  if (!loginResponse.success) {
    return {
      message: loginResponse.message,
      success: false
    }
  }

  return {
    data: loginResponse.data,
    success: true
  }
}
