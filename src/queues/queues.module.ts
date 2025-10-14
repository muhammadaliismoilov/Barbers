import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/clients/client.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Clients,BarberServices,UsersInfo])],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
