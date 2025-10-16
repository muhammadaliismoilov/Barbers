import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { Clients } from 'src/clients/client.entity';
import { Repository } from 'typeorm';
import { ClientQueueDto } from './dto/queues.dto';

import { throwError } from 'rxjs';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Injectable()
export class QueuesService {
    constructor(
        @InjectRepository(Clients)
        private clientRepo : Repository<Clients>,
        @InjectRepository(BarberServices)
        private barberServiceRepo : Repository<BarberServices>,
        @InjectRepository(UsersInfo)
        private barberRepo : Repository<UsersInfo>,
    ){}
async queues(barberId: string): Promise<ClientQueueDto[]> {
  try {
    const barber = await this.barberRepo.findOne({where:{id:barberId}})
    if(!barber) throw new NotFoundException('Barber topilmadi')
    const result = await this.clientRepo
      .createQueryBuilder('c')
      .innerJoin('c.barberService', 'bs')
      .innerJoin('c.barber', 'b')
      .innerJoin('b.userId', 'user')
      .select([
        'c.id AS id',
        'c.fullName AS name',
        'c.phone AS phone',
        'c.appointmentDate AS date',
        'c.appointmentTime AS time',
        'c.status AS status',
        'bs.title AS serviceTitle',
      ])
      .where('c.barberId = :barberId', { barberId })
      .orderBy('c.appointment_date', 'ASC')
      .addOrderBy('c.appointment_time', 'ASC')
      .getRawMany();
    return result
  } catch (error) {
    if(error instanceof NotFoundException) throw error
    
    throw new InternalServerErrorException(
      'Barber navbatini olishda xatolik yuz berdi',
      error.message,
    );
  }
}


}

