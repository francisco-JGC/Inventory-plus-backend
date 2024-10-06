import { AppDataSource } from '../config/database.config'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IHandleResponseController
} from './types'
import { ICreateOrder } from '../entities/order/types'
import { Order } from '../entities/order/order.entity'
import { OrderProduct } from '../entities/order/order-product.entity'
import { Product } from '../entities/products/product.entity'

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

    return handleSuccess(savedOrder)
  } catch (error: any) {
    return handleError(error.message)
  }
}
