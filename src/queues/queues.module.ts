import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/client.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { Barber } from 'src/barbers/barber.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Client,BarberService,Barber])],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
