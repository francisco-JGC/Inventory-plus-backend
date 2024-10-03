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
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Product, (product) => product.provider)
  products: Product[]
}
