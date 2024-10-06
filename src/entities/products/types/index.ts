export interface ICreateProduct {
  product_name: string
  price: number
  provider_name?: string
  description?: string
  category_name: string
  discount?: number
  stock: number
  status: 'show' | 'hide'
  low_stock_limit: number
}

export interface IProductResponse extends ICreateProduct {
  id: number
  created_at: Date
}
export interface IProductInvoice {
  id: number
  product_name: string
  price: number
  stock: number
}
