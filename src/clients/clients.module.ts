
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './client.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { Users } from 'src/users/user.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { BarberClientGateway } from 'src/webSocket/barber-client.gateway';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients, BarberServices, Users, UsersInfo])],
  controllers: [ClientsController],
  providers: [ClientsService, BarberClientGateway], // gateway shu yerda provid qilingan
  exports: [ClientsService, BarberClientGateway], // agar boshqa modul gateway'ni ishlatsa eksport qiling
})
export class ClientsModule {}
