import { BarberService } from 'src/barber_services/barber_service.entity';
import { Role, User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('barbers')
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.BARBER })
  role: Role;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  experienceYears: number;


  @Column({ type: 'varchar', length: 100, nullable: true })
  workHours: string; // Masalan: "09:00 - 20:00"

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Barber -> BarberService (1 -> ko‘p)
  @OneToMany(() => BarberService, (service) => service.barber)
  servicesList: BarberService[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
