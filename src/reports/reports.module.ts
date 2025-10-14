import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../clients/client.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Clients, BarberServices])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
