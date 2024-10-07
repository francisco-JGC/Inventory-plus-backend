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

  @Column({ type: 'int' })
  product_quantity: number

  @Column()
  inventory_value: number

  @CreateDateColumn()
  last_updated: Date
}
