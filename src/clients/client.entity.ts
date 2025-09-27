import { BarberService } from 'src/barber_services/barber_service.entity';
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
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('clients')
@Unique(['appointmentDate', 'appointmentTime', 'barberServiceId'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;
  @Column()
  barberServiceId: string;
  
  @ManyToOne(() => BarberService, (service) => service.id,)
  @JoinColumn({ name: 'barberServiceId' })
  barberService: BarberService;

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column({ type: 'time' })
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
