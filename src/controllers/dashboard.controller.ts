import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { AppDataSource } from '../config/database.config'
import { Order } from '../entities/order/order.entity'
import { getDefaultInventory } from './inventory.controller'
import { handleError, handleSuccess, IHandleResponseController } from './types'
import { IGetMonthlySalesInformation } from './types/dashboard.type'
import { Between } from 'typeorm'

export const getMonthlySalesInformation = async (): Promise<
  IHandleResponseController<IGetMonthlySalesInformation>
> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order)
    const inventory = await getDefaultInventory()

    const startOfCurrentMonth = startOfMonth(new Date())
    const endOfCurrentMonth = endOfMonth(new Date())

    const startOfLastMonth = startOfMonth(subMonths(new Date(), 1))
    const endOfLastMonth = endOfMonth(subMonths(new Date(), 1))

    const currentSales = await orderRepository.find({
      where: { created_at: Between(startOfCurrentMonth, endOfCurrentMonth) }
    })

    const lastSales = await orderRepository.find({
      where: { created_at: Between(startOfLastMonth, endOfLastMonth) }
    })

    const currentCash = currentSales
      .map((item) => item.total_price)
      .reduce((total, total_price) => total + total_price, 0)

    const lastCash = lastSales
      .map((item) => item.total_price)
      .reduce((total, total_price) => total + total_price, 0)

    return handleSuccess({
      total_cash: currentCash,
      total_product: inventory.product_quantity,
      total_inventory_value: inventory.inventory_value,
      total_sales: currentSales.length,
      sales_percentage: calculatePercentageDifference(
        currentSales.length,
        lastSales.length
      ),
      cash_percentage: calculatePercentageDifference(currentCash, lastCash)
    })
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const calculatePercentageDifference = (
  current: number,
  last: number
): number => {
  const difference = current - last
  const percentageDifference = (difference / last) * 100
  return percentageDifference.toFixed() === 'Infinity'
    ? 100
    : Number(percentageDifference.toFixed(2))
}
