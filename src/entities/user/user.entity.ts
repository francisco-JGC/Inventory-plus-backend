import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Role } from '../role/role.entity'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  password: string

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[]

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
