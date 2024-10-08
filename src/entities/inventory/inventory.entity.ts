import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm'

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'int', default: 0 })
  product_quantity: number

  @Column({ default: 0 })
  inventory_value: number

  @CreateDateColumn()
  last_updated: Date
}
