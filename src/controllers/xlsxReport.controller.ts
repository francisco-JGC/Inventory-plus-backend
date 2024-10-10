const XlsxPopulate = require('xlsx-populate')
import { Order } from '../entities/order/order.entity'
import { AppDataSource } from '../config/database.config'
import { Request, Response } from 'express'
import { DateFormat } from '../utils/date-format'
import { Provider } from '../entities/provider/provider.entity'

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
