import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Order } from '../order/order.entity'
import { Product } from '../products/product.entity'

@Entity('order_product')
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.orderProducts)
  order: Order

  @ManyToOne(() => Product, (product) => product.orderProducts)
  product: Product

  @Column()
  quantity: number

  @Column()
  price: number
}
