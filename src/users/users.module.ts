import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { Clients } from 'src/clients/client.entity';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Users,UsersInfo,BarberServices,Clients])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
