import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IHandleResponseController,
  IPagination
} from './types'
import { ICreateOrder } from '../entities/order/types'
import { Order } from '../entities/order/order.entity'
import { OrderProduct } from '../entities/order/order-product.entity'
import { Product } from '../entities/products/product.entity'
import { ILike } from 'typeorm'
import { generatePurchaseCode } from '../utils/generatePurchaseCode'

export const createOrder = async (
  order: ICreateOrder
): Promise<IHandleResponseController> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order)
    const orderProductRepository = AppDataSource.getRepository(OrderProduct)
    const productRepository = AppDataSource.getRepository(Product)

    const newOrder = new Order()
    newOrder.client_name = order.clientName
    newOrder.discount = order.discount
    newOrder.tax = order.tax
    newOrder.total_price = order.total
    newOrder.sale_status = true

    const savedOrder = await orderRepository.save(newOrder)

    for (const productOrder of order.products) {
      const product = await productRepository.findOne({
        where: { id: productOrder.product_id }
      })
      if (!product) {
        return handleNotFound(
          `Producto con ID ${productOrder.product_id} no encontrado`
        )
      }

      const orderProduct = new OrderProduct()
      orderProduct.order = savedOrder
      orderProduct.product = product
      orderProduct.price = productOrder.price
      orderProduct.quantity = productOrder.quantity

      await orderProductRepository.save(orderProduct)

      product.stock -= productOrder.quantity
      await productRepository.save(product)
    }

    savedOrder.code = generatePurchaseCode(savedOrder.id)
    await orderRepository.save(savedOrder)

    return handleSuccess(savedOrder)
  } catch (error: any) {
    return handleError(error)
  }
}

export const getPaginationOrders = async ({
  filter,
  page,
  limit
}: IPagination): Promise<IHandleResponseController> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Numero de pagina o limite son valores invalidos')
    }

    const orders = await AppDataSource.getRepository(Order).find({
      where: { code: ILike(`%${filter ? filter : ''}%`) },
      relations: ['orderProducts', 'orderProducts.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    })

    const formatedOrders = orders.map((order) => {
      return {
        id: order.id,
        created_at: order.created_at,
        total: order.total_price,
        total_products: order.orderProducts.length,
        code: order.code || 'xxx',
        client_name: order.client_name || 'xxx',
        sale_status: order.sale_status
      }
    })

    return handleSuccess(formatedOrders)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const changeOrderStatusSale = async (
  id: number
): Promise<IHandleResponseController<Order>> => {
  try {
    const order = await AppDataSource.getRepository(Order).findOne({
      where: { id }
    })

    if (!order) {
      return handleNotFound('Orden no encontrada')
    }

    order.sale_status = !order.sale_status

    return handleSuccess(await AppDataSource.getRepository(Order).save(order))
  } catch (error: any) {
    console.log(error.message)
    return handleError(error.message)
  }
}

export const getInvoiceDetailsById = async (
  id: number
): Promise<IHandleResponseController<Order>> => {
  try {
    const order = await AppDataSource.getRepository(Order).findOne({
      where: { id },
      relations: ['orderProducts', 'orderProducts.product']
    })

    if (!order) {
      return handleNotFound('Factura no encontrada')
    }

    return handleSuccess(order)
  } catch (error: any) {
    return handleError(error.message)
  }
}
