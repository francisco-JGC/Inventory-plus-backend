import type { Role } from '../../role/role.entity'

export interface IResponseUser {
  username: string
  email: string
  id: number
  roles?: Role[]
}

export interface ICreateUser {
  username: string
  email: string
  password: string
}

export interface IFindUserByEmail {
  email: string
}

export interface ILogin {
  email: string
  password: string
}

export interface ILoginResponse {
  token: string
  username: string
  email: string
  role: string
}

export interface IUpdateUser {
  id: number
  email: string
  username: string
  password?: string
  role_name: string
}
