
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { User } from 'src/users/user.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Barber } from 'src/barbers/barber.entity';
import { BarberClientGateway } from 'src/webSocket/barber-client.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Client, BarberService, User, Barber])],
  controllers: [ClientsController],
  providers: [ClientsService, BarberClientGateway], // gateway shu yerda provid qilingan
  exports: [ClientsService, BarberClientGateway], // agar boshqa modul gateway'ni ishlatsa eksport qiling
})
export class ClientsModule {}
