import { BarberServices } from 'src/barber_services/barber_service.entity';
import { UsersInfo } from 'src/users_info/users_info.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum ClientStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
}

@Entity('clients')
@Unique(['appointmentDate', 'appointmentTime', 'barberServiceId'])
export class Clients {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ name: 'barber_id' })
  barberId: string;

  @ManyToOne(() => UsersInfo, (barber) => barber.clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barber_id' })
  barber: UsersInfo;

  @Column({ name: 'barber_service_id' })
  barberServiceId: string;

  @ManyToOne(() => BarberServices, (service) => service.id)
  @JoinColumn({ name: 'barber_service_id' })
  barberService: BarberServices;

  @Column({ type: 'date' ,name: 'appointment_date' })
  appointmentDate: string;

  @Column({ type: 'time' ,name: 'appointment_time' })
  appointmentTime: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.PENDING,
  })
  status: ClientStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
