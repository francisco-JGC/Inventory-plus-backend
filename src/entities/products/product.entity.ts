import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { Order } from '../order/order.entity'
import { Category } from '../categories/category.entity'
import { Inventory } from '../inventory/inventory.entity'
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

  @ManyToOne(() => Order, (order) => order.products, { nullable: true })
  orders?: Order

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[]

  @ManyToOne(() => Provider, (provider) => provider.products)
  provider: Provider

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
