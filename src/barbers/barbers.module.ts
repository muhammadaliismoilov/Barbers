import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './barber.entity';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Barber,BarbersService])],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
