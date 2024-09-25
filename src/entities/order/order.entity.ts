import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm'
import { Product } from '../products/product.entity'
import { Sales } from '../sales/sales.entity'

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Product, (product) => product.orders)
  products: Product[]

  @OneToMany(() => Sales, (sales) => sales.order)
  sales: Sales[]

  @Column()
  sale_status: boolean

  @Column({ nullable: true })
  client_name?: string

  @Column({ nullable: true })
  phone_number?: string

  @Column()
  total_price: number

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
