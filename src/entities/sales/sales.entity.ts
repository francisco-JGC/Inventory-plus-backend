import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'
import { Order } from '../order/order.entity'

@Entity('sales')
export class Sales {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.sales)
  order: Order

  @Column()
  payment_method: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number

  @Column()
  sale_status: 'completed' | 'pending'

  @Column({ nullable: true })
  sale_note?: string

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
