export interface ICreateOrder {
  clientName: string
  products: IProductOrder[]
  discount: number
  tax: number
  total: number
}

export interface IProductOrder {
  product_id: number
  quantity: number
  price: number
}
