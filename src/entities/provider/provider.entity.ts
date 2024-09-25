import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from 'typeorm'
import { Product } from '../products/product.entity'

@Entity('provider')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  provider_name: string

  @Column()
  contact_email: string

  @Column()
  phone_number: string

  @Column({ nullable: true })
  address?: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Product, (product) => product.provider)
  products: Product[]
}
