import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Barber } from 'src/barbers/barber.entity';

@Entity('Barber_services')
export class BarberService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'barber_id' })
  barberId: string;
  
  @ManyToOne(() => Barber, (barber) => barber.servicesList, {
    onDelete: 'CASCADE', 
  })
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string; // xizmat nomi (masalan: "Soch olish")

  @Column()
  price: number; // narxi (masalan: 50000)

  @Column({ type: 'int' })
  duration: number; // qancha vaqt davom etadi (minutlarda)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
