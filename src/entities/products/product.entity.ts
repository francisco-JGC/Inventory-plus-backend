import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { OrderProduct } from '../order/order-product.entity'
import { Category } from '../categories/category.entity'
import { Provider } from '../provider/provider.entity'

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  product_name: string

  @Column()
  price: number

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => Category, (category) => category.products)
  category: Category

  @Column({ nullable: true, default: 0 })
  discount?: number

  @Column()
  stock: number

  @Column()
  status: 'show' | 'hide'

  @Column()
  low_stock_limit: number

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[]

  @ManyToOne(() => Provider, (provider) => provider.products, {
    nullable: true
  })
  provider: Provider | null

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
