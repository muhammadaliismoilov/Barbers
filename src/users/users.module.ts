import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Barber,BarberService])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
