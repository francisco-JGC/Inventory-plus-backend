import { AppDataSource } from '../config/database.config'
import { Inventory } from '../entities/inventory/inventory.entity'
import { IDetailsInventory } from '../entities/inventory/types'
import { getAlertLowStockFromProduct } from './product.controller'
import { getAllProviders } from './provider.controller'
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

      if (existInventory.id) {
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

export const getDefaultInventory = async (): Promise<Inventory> => {
  const inventory = await AppDataSource.getRepository(Inventory).findOne({
    where: { name: 'default' }
  })

  return inventory || ({} as any)
}

export const getInventoryDetails = async (): Promise<
  IHandleResponseController<IDetailsInventory>
> => {
  try {
    const inventory = await getDefaultInventory()
    const providerResponse = await getAllProviders()
    const productsWithLowStock = await getAlertLowStockFromProduct()

    const { data: providers } = providerResponse

    return handleSuccess({
      total_value: inventory.inventory_value || 0,
      total_product: inventory.product_quantity || 0,
      total_providers: providers?.length || 0,
      productsWithLowStock: productsWithLowStock.data?.length || 0
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}
