import { UsersInfo } from 'src/users_info/users_info.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

export enum Role {
  BARBER = 'barber',
  ADMIN = 'admin',
  USER = 'user',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  role: string[];

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

    @OneToOne(() => UsersInfo, (userInfo: UsersInfo) => userInfo.userId, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userInfo: UsersInfo;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken?: string | null;

}
