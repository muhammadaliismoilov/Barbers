import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { Client } from 'src/clients/client.entity';
import { Repository } from 'typeorm';
import { ClientQueueDto } from './dto/queues.dto';
import { Barber } from 'src/barbers/barber.entity';
import { throwError } from 'rxjs';

@Injectable()
export class QueuesService {
    constructor(
        @InjectRepository(Client)
        private clientRepo : Repository<Client>,
        @InjectRepository(BarberService)
        private barberServiceRepo : Repository<BarberService>,
        @InjectRepository(Barber)
        private barberRepo : Repository<Barber>,
    ){}
async queues(barberId: string): Promise<ClientQueueDto[]> {
  try {
    const barber = await this.barberRepo.findOne({where:{id:barberId}})
    if(!barber) throw new NotFoundException('Barber topilmadi')
    const result = await this.clientRepo
      .createQueryBuilder('c')
      .innerJoin('c.barberService', 'bs')
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.phone AS phone',
        'c.appointmentDate AS date',
        'c.appointmentTime AS time',
        'c.status AS status',
        'bs.title AS serviceTitle',
      ])
      .where('c.barberId = :barberId', { barberId })
      .orderBy('c.appointmentDate', 'ASC')
      .addOrderBy('c.appointmentTime', 'ASC')
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

