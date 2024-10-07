import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm'
import { OrderProduct } from './order-product.entity'

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[]

  @Column()
  sale_status: boolean

  @Column({ nullable: true })
  client_name?: string

  @Column({ nullable: true })
  phone_number?: string

  @Column({ type: 'float' })
  total_price: number

  @Column()
  discount: number

  @Column({ default: '' })
  code: string

  @Column()
  tax: number

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
