import { AppDataSource } from '../../config/database.config'
import { Role } from '../../entities/role/role.entity'
import { createDefaultUsers } from './user.initializer'

export const createDefaultRoles = async () => {
  try {
    const defaultRoles = [
      {
        name: 'admin',
        description: '',
        label: 'Administrador'
      },
      {
        name: 'seller',
        description: '',
        label: 'Vendedor'
      },
      {
        name: 'inventory',
        description: '',
        label: 'Inventario'
      }
    ]

    for (const role of defaultRoles) {
      const roleExists = await AppDataSource.getRepository(Role).findOne({
        where: { name: role.name }
      })

      if (!roleExists) {
        await AppDataSource.getRepository(Role).save(role)
      }
    }

    return await createDefaultUsers()
  } catch (error) {
    console.error({ error })
  }
}
