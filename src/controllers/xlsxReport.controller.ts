const XlsxPopulate = require('xlsx-populate')
import { Order } from '../entities/order/order.entity'
import { AppDataSource } from '../config/database.config'
import { Request, Response } from 'express'
import { DateFormat } from '../utils/date-format'
import { Provider } from '../entities/provider/provider.entity'
import { Product } from '../entities/products/product.entity'
import { getSalesLastSixMonths, getTop7Products } from './dashboard.controller'
import { User } from '../entities/user/user.entity'

export const generateSalesReport = async () => {
  try {
    const orders = await AppDataSource.getRepository(Order).find({
      relations: ['orderProducts', 'orderProducts.product']
    })

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'Código',
      'Nombre del cliente',
      'Total de productos',
      'Total de venta',
      'Descuento',
      'Factura creada en'
    ]
    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    let totalSales = 0

    orders.forEach((order: any, index: any) => {
      const row = index + 2

      totalSales += order.total_price

      sheet.cell(`A${row}`).value(order.code)
      sheet.cell(`B${row}`).value(order.client_name || '-----')
      sheet.cell(`C${row}`).value(order.orderProducts.length)
      sheet.cell(`D${row}`).value(order.total_price)
      sheet.cell(`E${row}`).value(order.discount)
      sheet.cell(`F${row}`).value(DateFormat(order.created_at))
      ;['A', 'B', 'C', 'D', 'E', 'F'].forEach((column) => {
        sheet.cell(`${column}${row}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D', 'E', 'F'].forEach((column) => {
      sheet.column(column).width(20)
    })

    sheet
      .range('D2:D' + (orders.length + 1))
      .style('numberFormat', '$ #,##0.00')
    sheet.range('E2:E' + (orders.length + 1)).style('numberFormat', '0%')

    const totalRow = orders.length + 2
    sheet.cell(`C${totalRow}`).value('Total de ventas').style({
      bold: true,
      horizontalAlignment: 'center'
    })

    sheet.cell(`D${totalRow}`).value(totalSales).style({
      bold: true,
      numberFormat: '$ #,##0.00',
      border: true
    })

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el reporte:', error)
    throw new Error('No se pudo generar el reporte de ventas.')
  }
}

export const downloadSalesReport = async (_req: Request, res: Response) => {
  try {
    const reportBuffer = await generateSalesReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}

export const generateProvidersReport = async () => {
  try {
    const providers = await AppDataSource.getRepository(Provider).find({
      relations: ['products']
    })

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'Correo electrónico',
      'Nombre del proveedor',
      'Dirección',
      'Teléfono',
      'Cantidad de productos'
    ]

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    providers.forEach((provider: Provider, index: number) => {
      const row = index + 2

      sheet.cell(`A${row}`).value(provider.email)
      sheet.cell(`B${row}`).value(provider.name)
      sheet.cell(`C${row}`).value(provider.address || '-----')
      sheet.cell(`D${row}`).value(provider.phone)
      sheet.cell(`E${row}`).value(provider.products.length)
      ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
        sheet.cell(`${column}${row}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
      sheet.column(column).width(25)
    })

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el reporte de proveedores:', error)
    throw new Error('No se pudo generar el reporte de proveedores.')
  }
}

export const downloadProvidersReport = async (_req: Request, res: Response) => {
  try {
    const reportBuffer = await generateProvidersReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}

export const generateInventoryReport = async () => {
  try {
    const products = await AppDataSource.getRepository(Product).find({
      relations: ['provider']
    })

    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    )
    const totalProducts = products.length
    const totalProviders = await AppDataSource.getRepository(Provider).count()
    const lowStockProductsCount = products.filter(
      (product) => product.stock < product.low_stock_limit
    ).length

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'Nombre del producto',
      'Stock',
      'Límite de Stock Bajo',
      'Nombre de proveedor',
      'Fecha de Creación',
      'Precio'
    ]

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    products.forEach((product, index) => {
      const row = index + 2

      sheet.cell(`A${row}`).value(product.product_name)
      sheet.cell(`B${row}`).value(product.stock)
      sheet.cell(`C${row}`).value(product.low_stock_limit)
      sheet
        .cell(`D${row}`)
        .value(product.provider ? product.provider.name : '-----')
      sheet.cell(`E${row}`).value(product.created_at)
      sheet.cell(`F${row}`).value(product.price)
      ;['A', 'B', 'C', 'D', 'E', 'F'].forEach((column) => {
        sheet.cell(`${column}${row}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D', 'E', 'F'].forEach((column) => {
      sheet.column(column).width(25)
    })

    const statsRow = products.length + 3
    sheet
      .cell(`A${statsRow}`)
      .value('Valor total de inventario:')
      .style({ bold: true })
    sheet.cell(`B${statsRow}`).value(totalInventoryValue).style({
      numberFormat: '$ #,##0.00',
      bold: true,
      border: true
    })

    sheet
      .cell(`A${statsRow + 1}`)
      .value('Total de productos:')
      .style({ bold: true })
    sheet
      .cell(`B${statsRow + 1}`)
      .value(totalProducts)
      .style({
        bold: true,
        border: true
      })

    sheet
      .cell(`A${statsRow + 2}`)
      .value('Total de proveedores:')
      .style({ bold: true })
    sheet
      .cell(`B${statsRow + 2}`)
      .value(totalProviders)
      .style({
        bold: true,
        border: true
      })

    sheet
      .cell(`A${statsRow + 3}`)
      .value('Productos con stock bajo:')
      .style({ bold: true })
    sheet
      .cell(`B${statsRow + 3}`)
      .value(lowStockProductsCount)
      .style({
        bold: true,
        border: true
      })

    for (let i = statsRow; i <= statsRow + 3; i++) {
      sheet.cell(`A${i}`).style({
        horizontalAlignment: 'right'
      })
    }

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el reporte de inventario:', error)
    throw new Error('No se pudo generar el reporte de inventario.')
  }
}

export const downloadInventoryReport = async (_req: Request, res: Response) => {
  try {
    const reportBuffer = await generateInventoryReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}

export const generateFluctuationReport = async () => {
  try {
    const { data: fluctuation } = await getSalesLastSixMonths()

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'Mes',
      'Total de Ventas',
      'Total de Ingresos',
      'Fecha de Inicio',
      'Fecha de Fin'
    ]

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    fluctuation?.forEach((data, index) => {
      const rowIndex = index + 2

      const month = new Date(data.startDate).toLocaleString('default', {
        month: 'long'
      })

      sheet.cell(`A${rowIndex}`).value(month)
      sheet.cell(`B${rowIndex}`).value(data.totalSales)
      sheet.cell(`C${rowIndex}`).value(data.totalRevenue)
      sheet.cell(`D${rowIndex}`).value(DateFormat(data.startDate))
      sheet.cell(`E${rowIndex}`).value(DateFormat(data.endDate))
      ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
        sheet.cell(`${column}${rowIndex}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
      sheet.column(column).width(20)
    })

    const totalRow = (fluctuation?.length || 0) + 2
    sheet.cell(`A${totalRow}`).value('Total').style({
      bold: true,
      horizontalAlignment: 'right'
    })

    const totalSales = fluctuation?.reduce(
      (total, data) => total + data.totalSales,
      0
    )
    const totalRevenue = fluctuation?.reduce(
      (total, data) => total + data.totalRevenue,
      0
    )

    sheet.cell(`B${totalRow}`).value(totalSales).style({
      bold: true,
      border: true
    })

    sheet.cell(`C${totalRow}`).value(totalRevenue).style({
      bold: true,
      border: true
    })

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el informe de ventas del mes:', error)
    throw new Error('No se pudo generar el informe de ventas del mes.')
  }
}

export const downloadFluctuationReport = async (
  _req: Request,
  res: Response
) => {
  try {
    const reportBuffer = await generateFluctuationReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}

export const generateUserReport = async () => {
  try {
    const users: User[] = await AppDataSource.getRepository(User).find({
      relations: ['roles']
    })

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'Correo Electrónico',
      'Nombre de Usuario',
      'Fecha de Creación',
      'Nombre del Rol'
    ]

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    users.forEach((user, index) => {
      const rowIndex = index + 2

      sheet.cell(`A${rowIndex}`).value(user.email)
      sheet.cell(`B${rowIndex}`).value(user.username)
      sheet
        .cell(`C${rowIndex}`)
        .value(user.created_at.toISOString().split('T')[0])
      sheet
        .cell(`D${rowIndex}`)
        .value(user.roles.map((role) => role.label).join(', '))
      ;['A', 'B', 'C', 'D'].forEach((column) => {
        sheet.cell(`${column}${rowIndex}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D'].forEach((column) => {
      sheet.column(column).width(25)
    })

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el informe de usuarios:', error)
    throw new Error('No se pudo generar el informe de usuarios.')
  }
}

export const downloadUserReport = async (_req: Request, res: Response) => {
  try {
    const reportBuffer = await generateUserReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}

export const generateTopProductsReport = async () => {
  try {
    const { data: topProducts } = await getTop7Products()

    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet(0)

    const headers = [
      'ID del Producto',
      'Nombre del Producto',
      'Nombre del Proveedor',
      'Stock',
      'Total Vendido'
    ]

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1)
      cell.value(header)
      cell.style({
        bold: true,
        fontSize: 12,
        fontColor: 'FFFFFF',
        fill: '4F81BD',
        horizontalAlignment: 'center',
        verticalAlignment: 'center'
      })
    })

    topProducts?.forEach((product, index) => {
      const rowIndex = index + 2

      sheet.cell(`A${rowIndex}`).value(product.id)
      sheet.cell(`B${rowIndex}`).value(product.product_name)
      sheet.cell(`C${rowIndex}`).value(product.provider_name)
      sheet.cell(`D${rowIndex}`).value(product.stock)
      sheet.cell(`E${rowIndex}`).value(product.total_sold)
      ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
        sheet.cell(`${column}${rowIndex}`).style({
          border: true,
          horizontalAlignment: 'center',
          verticalAlignment: 'center'
        })
      })
    })
    ;['A', 'B', 'C', 'D', 'E'].forEach((column) => {
      sheet.column(column).width(20)
    })

    const buffer = await workbook.outputAsync()
    return buffer
  } catch (error) {
    console.error('Error generando el informe de productos top:', error)
    throw new Error('No se pudo generar el informe de productos top.')
  }
}

export const downloadTopProductsReport = async (
  _req: Request,
  res: Response
) => {
  try {
    const reportBuffer = await generateTopProductsReport()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_de_ventas.xlsx'
    )

    res.send(reportBuffer)
  } catch (error) {
    console.error('Error al generar el reporte de ventas:', error)
    res.status(500).json({ message: 'Error al generar el reporte de ventas.' })
  }
}
