import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('barber_services')
export class BarberService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id ' })
  barber: User; // qaysi sartaroshga tegishli xizmat

  @Column({ type: 'varchar', length: 100, nullable:false })
  title: string; // xizmat nomi (masalan: "Soch olish")

  @Column()
  price: number; // narxi (masalan: 50000.00)

  @Column({ type: 'int' })
  duration: number; // qancha vaqt davom etadi (minutlarda)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
