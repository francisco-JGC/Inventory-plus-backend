import { AppDataSource } from '../config/database.config'
import { Product } from '../entities/products/product.entity'
import {
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import {
  ICreateProduct,
  IProductInvoice,
  IProductResponse
} from '../entities/products/types'
import { getCategoryByName } from './category.controller'
import { getProviderByName } from './provider.controller'
import { Provider } from '../entities/provider/provider.entity'
// import { Inventory } from '../entities/inventory/inventory.entity'

export const createProduct = async (
  product: ICreateProduct
): Promise<IHandleResponseController<IProductResponse>> => {
  try {
    const category = await getCategoryByName(product.category_name)

    if (!category.data) {
      return {
        message: 'Por favor, seleccione una categoría válida',
        success: false
      }
    }
    const provider = await getProviderByName(product.provider_name as string)

    if (!provider.success) {
      return handleNotFound('No se encontro el proveedor de este producto')
    }

    const newProduct = AppDataSource.getRepository(Product).create({
      ...product,
      category: category.data,
      provider: provider.data
    })

    const createdProduct =
      await AppDataSource.getRepository(Product).save(newProduct)

    if (provider.data && !provider.data.products) {
      provider.data.products = []
    }

    if (provider.data) {
      provider?.data.products.push(createdProduct)
      await AppDataSource.getRepository(Provider).save(provider.data)
    }

    return {
      data: {
        ...newProduct,
        category_name: category.data.name
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

export const getProductsInvoice = async (): Promise<
  IHandleResponseController<IProductInvoice[]>
> => {
  try {
    const products = await AppDataSource.getRepository(Product).find()

    if (!products) {
      return {
        message: 'No hay productos disponibles',
        success: false
      }
    }

    return handleSuccess(products)
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}
