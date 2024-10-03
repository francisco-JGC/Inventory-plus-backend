import { Product } from '../../products/product.entity'

export interface ICreateProvider {
  name: string
  phone: string
  email: string
  address: string
}

export interface IProviderResponse extends ICreateProvider {
  id: number
  created_at: Date
  products: Product[]
}
