import { AppDataSource } from '../config/database.config'
import { Inventory } from '../entities/inventory/inventory.entity'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IHandleResponseController
} from './types'

export const createDefaultInventory =
  async (): Promise<IHandleResponseController> => {
    try {
      const existInventory = await getDefaultInventory()

      if (existInventory.success) {
        return handleNotFound('El inventario ya existe')
      }

      const inventory = AppDataSource.getRepository(Inventory).create({
        name: 'default',
        product_quantity: 0,
        inventory_value: 0
      })

      await AppDataSource.getRepository(Inventory).save(inventory)
      return handleSuccess('Inventario por defecto creado')
    } catch (error: any) {
      return handleError(error.message)
    }
  }

export const getDefaultInventory =
  async (): Promise<IHandleResponseController> => {
    try {
      const inventory = await AppDataSource.getRepository(Inventory).find({
        where: { name: 'default' }
      })

      if (inventory) {
        return handleNotFound('Inventario no encontrado')
      }

      return handleSuccess(inventory)
    } catch (error: any) {
      return handleError(error.message)
    }
  }
