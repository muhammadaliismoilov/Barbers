import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { User } from 'src/users/user.entity';
import { ClientsController } from './clients.controller';
import { Barber } from 'src/barbers/barber.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Client,BarberService,User,Barber])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
