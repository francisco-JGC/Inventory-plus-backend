import { AppDataSource } from '../config/database.config'
import { Product } from '../entities/products/product.entity'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IPagination,
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
import { getDefaultInventory } from './inventory.controller'
import { Inventory } from '../entities/inventory/inventory.entity'
import { ILike } from 'typeorm'
import { Category } from '../entities/categories/category.entity'
import { OrderProduct } from '../entities/order/order-product.entity'

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
    const inventory = await getDefaultInventory()

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

    inventory.inventory_value =
      Number(inventory.inventory_value) + Number(product.price)
    inventory.product_quantity = Number(inventory.product_quantity) + 1

    await AppDataSource.getRepository(Inventory).save(inventory)

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

export const getAlertLowStockFromProduct = async (): Promise<
  IHandleResponseController<Product[]>
> => {
  try {
    const products = await AppDataSource.getRepository(Product).find()

    const productsWithLowStock = products.filter(
      (product) => product.low_stock_limit > product.stock
    )

    return handleSuccess(productsWithLowStock)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getPaginationProduct = async ({
  filter,
  page,
  limit
}: IPagination): Promise<IHandleResponseController> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Numero de pagina o limite son valores invalidos')
    }

    const products = await AppDataSource.getRepository(Product).find({
      where: { product_name: ILike(`%${filter ? filter : ''}%`) },
      relations: ['provider'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    })

    const formatedProduct = products.map((product) => {
      return {
        id: product.id,
        product_name: product.product_name,
        stock: product.stock,
        low_stock_limit: product.low_stock_limit,
        status: product.status,
        created_at: product.created_at,
        provider_name: product.provider?.name || '',
        price: product.price
      }
    })

    return handleSuccess(formatedProduct)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const deleteProductById = async (
  id: number
): Promise<IHandleResponseController<Product>> => {
  try {
    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id }
    })
    const inventory = await getDefaultInventory()

    if (!product) {
      return handleNotFound('Producto no encontrado')
    }

    inventory.inventory_value =
      Number(inventory.inventory_value) - product.price
    inventory.product_quantity = Number(inventory.product_quantity) - 1

    await AppDataSource.getRepository(Inventory).save(inventory)

    await AppDataSource.getRepository(OrderProduct)
      .createQueryBuilder()
      .delete()
      .from(OrderProduct)
      .where('productId = :productId', { productId: product.id })
      .execute()

    return handleSuccess(
      await AppDataSource.getRepository(Product).remove(product)
    )
  } catch (error: any) {
    console.log(error.message)
    return handleError(error.message)
  }
}

export const replenishStock = async (
  id: number,
  amount: number
): Promise<IHandleResponseController<Product>> => {
  try {
    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id }
    })

    if (!product) {
      return handleNotFound('Producto no encontrado')
    }

    product.stock += amount

    return handleSuccess(
      await AppDataSource.getRepository(Product).save(product)
    )
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const updateProductById = async (
  productData: ICreateProduct,
  id: number
): Promise<IHandleResponseController<Product>> => {
  try {
    const productRepository = AppDataSource.getRepository(Product)
    const providerRepository = AppDataSource.getRepository(Provider)
    const categoryRepository = AppDataSource.getRepository(Category)

    const productExist = await productRepository.findOne({
      where: { id },
      relations: ['provider', 'category']
    })

    if (!productExist) {
      return handleNotFound('Producto no encontrado')
    }

    if (productData.provider_name) {
      const provider = await providerRepository.findOne({
        where: { name: productData.provider_name }
      })

      if (!provider) {
        return handleNotFound('Proveedor no encontrado')
      }

      productExist.provider = provider
    }

    if (productData.category_name) {
      const category = await categoryRepository.findOne({
        where: { name: productData.category_name }
      })

      if (!category) {
        return handleNotFound('Categoría no encontrada')
      }

      productExist.category = category
    }

    productExist.product_name = productData.product_name
    productExist.price = productData.price
    productExist.description = productData.description
    productExist.discount = productData.discount
    productExist.stock = productData.stock
    productExist.status = productData.status
    productExist.low_stock_limit = productData.low_stock_limit

    const updatedProduct = await productRepository.save(productExist)

    return handleSuccess(updatedProduct)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getProductById = async (
  id: number
): Promise<IHandleResponseController<Product>> => {
  try {
    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id },
      relations: ['category', 'provider']
    })

    if (!product) {
      return handleNotFound('Producto no encontrado')
    }

    return handleSuccess(product)
  } catch (error: any) {
    return handleError(error.message)
  }
}
