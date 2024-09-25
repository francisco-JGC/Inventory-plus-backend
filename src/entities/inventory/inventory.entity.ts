import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'
import { Product } from '../products/product.entity'

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, (product) => product.inventory)
  product: Product

  @Column({ type: 'int' })
  quantity: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  warehouse_location: string

  @CreateDateColumn()
  last_updated: Date
}
