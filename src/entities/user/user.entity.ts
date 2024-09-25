import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  JoinColumn
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

  @OneToMany(() => Role, (Role) => Role.user)
  @JoinColumn()
  roles?: Role[]

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
