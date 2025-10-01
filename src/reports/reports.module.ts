import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/client.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Client, BarberService])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
