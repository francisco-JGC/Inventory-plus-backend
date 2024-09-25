import { AppDataSource } from '../config/database.config'
import { Product } from '../entities/products/product.entity'
import type { IHandleResponseController } from './types'
import { ICreateProduct, IProductResponse } from '../entities/products/types'
import { getCategoryByName } from './category.controller'

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

    const newProduct = AppDataSource.getRepository(Product).create({
      ...product,
      category: category.data
    })

    await AppDataSource.getRepository(Product).save(newProduct)

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

export const getProducts = async (): Promise<
  IHandleResponseController<IProductResponse[]>
> => {
  try {
    const products = await AppDataSource.getRepository(Product).find()

    if (!products) {
      return {
        message: 'No hay productos disponibles',
        success: false
      }
    }

    return {
      data: products.map((product) => ({
        ...product,
        category_name: product.category.name
      })),
      success: true
    }
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}
