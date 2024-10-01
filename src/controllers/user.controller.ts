import { hash } from 'bcrypt'
import { User } from '../entities/user/user.entity'
import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import {
  ICreateUser,
  IResponseUser,
  IFindUserByEmail
} from '../entities/user/types'
import { getRoleByName } from './role.controller'
import { Role } from '../entities/role/role.entity'

export const createUser = async ({
  username,
  email,
  password
}: ICreateUser): Promise<IHandleResponseController<IResponseUser>> => {
  if (!username || !email || !password) {
    return {
      message: 'Todos los campos son requeridos',
      success: false
    }
  }

  if (email.indexOf('@') === -1) {
    return {
      message: 'Email no válido',
      success: false
    }
  }

  if (password.length < 6) {
    return {
      message: 'La contraseña debe tener al menos 6 caracteres',
      success: false
    }
  }

  try {
    const userExists = await AppDataSource.getRepository(User).findOne({
      where: { email }
    })

    if (userExists) {
      return {
        message: 'El email ya está en uso, por favor intenta con otro',
        success: false
      }
    }

    const user = new User()
    user.username = username
    user.email = email
    user.password = await hash(password, 10)

    const newUser = await AppDataSource.getRepository(User).save(user)

    return {
      data: {
        username: newUser.username,
        email: newUser.email,
        id: newUser.id
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

export const findUserByEmail = async ({
  email
}: IFindUserByEmail): Promise<IHandleResponseController<IResponseUser>> => {
  if (!email) {
    return {
      message: 'El email es requerido',
      success: false
    }
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
      relations: ['roles']
    })

    if (!user) {
      return handleNotFound('Usuario no encontrado')
    }

    return handleSuccess({
      username: user.username,
      email: user.email,
      id: user.id,
      roles: user.roles
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const assignRoleToUser = async ({
  userId,
  role_name
}: {
  userId: number
  role_name: string
}): Promise<IHandleResponseController<IResponseUser>> => {
  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ['roles']
    })

    if (!user) {
      return handleNotFound('Usuario no encontrado')
    }

    const { data: role, success } = await getRoleByName(role_name)

    if (!success) {
      return handleNotFound('No se encontro un rol con ese nombre')
    }

    const roleExists = user.roles.find(
      (itemRole) => itemRole.id === Number(role?.id)
    )

    if (roleExists) {
      return handleNotFound('El usuario ya tiene asignado este rol')
    }

    user.roles.push(role as Role)
    const response = await AppDataSource.getRepository(User).save(user)

    return handleSuccess(response)
  } catch (error: any) {
    return handleError(error.message)
  }
}
