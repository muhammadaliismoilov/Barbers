import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/user.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { Clients } from 'src/clients/client.entity';

@Entity('user_info')
export class UsersInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Users, (user) => user.userInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: Users;

  @Column({ type: 'int', default: 0 })
  totalSum: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  workHours: string; // Masalan: "09:00 - 20:00"

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Barber -> BarberService (1 -> ko‘p)
  @OneToMany(() => BarberServices, (service) => service.barber, { cascade: true })
  servicesList: BarberServices[];

  @OneToMany(() => Clients, (client) => client.barber)
  clients: Clients[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
