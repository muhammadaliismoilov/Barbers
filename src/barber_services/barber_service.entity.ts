import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UsersInfo } from 'src/users_info/users_info.entity';


@Entity('barber_services')
export class BarberServices {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'barber_id' })
  barberId: string;

  @ManyToOne(() => UsersInfo, (barber) => barber.servicesList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: UsersInfo;

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
