import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberService } from './barber_service.entity';
import { BarberServicesService } from './barber_services.service';
import { BarberServicesController } from './barber_services.controller';
import { Barber } from 'src/barbers/barber.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BarberService,Barber])],
  providers: [BarberServicesService],
  controllers: [BarberServicesController],
})
export class BarberServicesModule {}
