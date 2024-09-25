import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { User } from '../user/user.entity'

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.roles)
  user: User

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string

  @Column({ type: 'varchar', length: 255 })
  description: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
