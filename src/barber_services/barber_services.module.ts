import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberServices } from './barber_service.entity';
import { BarberServicesService } from './barber_services.service';
import { BarberServicesController } from './barber_services.controller';
import { UsersInfo } from 'src/users_info/users_info.entity';



@Module({
  imports: [TypeOrmModule.forFeature([BarberServices,UsersInfo])],
  providers: [BarberServicesService],
  controllers: [BarberServicesController],
})
export class BarberServicesModule {}
