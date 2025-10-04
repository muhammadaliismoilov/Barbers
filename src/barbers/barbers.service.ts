import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Barber } from './barber.entity';
import { CreateBarberDto, UpdateBarberDto } from './dto/barbers.dto';

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
  ) {}

  async create(dto: CreateBarberDto): Promise<Barber> {
    try {
      const barberFind = await this.barberRepository.findOne({
        where: { phone: dto.phone },
      });
      if (barberFind)
        throw new ConflictException('Bu raqam bilan royatdan o`tilgan');
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const barber = this.barberRepository.create({
        ...dto,
        password: hashedPassword,
      });
      return this.barberRepository.save(barber);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Barber qo`shishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findAll(): Promise<Barber[]> {
    try {
      return this.barberRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Barcha barberlarni olishda serveda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findOne(barberId: string): Promise<Barber> {
  try {
    const barber = await this.barberRepository.findOne({
      where: { id: barberId },
      relations: ['servicesList','clients'], // shu yerda relationni chaqiramiz
    });

    if (!barber) throw new NotFoundException('Berilgan barber topilmadi');

    return barber;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;  
    throw new InternalServerErrorException(
      'Barberni olishda serverda xatolik yuz berdi',
      error.message,
    );
  }
}


  async update(id: string, dto: UpdateBarberDto) {
    try {
      const barber = await this.barberRepository.findOne({ where: { id } });
      if (!barber) {
        throw new NotFoundException(`Barber topilmadi (id: ${id})`);
      }
  
      for (const [key, value] of Object.entries(dto)) {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'role') {
            // agar string bo‘lsa arrayga o‘ramiz
            const newRoles = Array.isArray(value) ? value : [value];
  
            // eski ro‘llarni saqlab, yangilarni qo‘shamiz (dublikatlarni oldini olamiz)
            const mergedRoles = Array.from(new Set([...(barber.role || []), ...newRoles]));
  
            (barber as any)[key] = mergedRoles;
          } else {
            (barber as any)[key] = value;
          }
        }
      }
      return await this.barberRepository.save(barber);
    } catch (error) {
      if(error instanceof NotFoundException)throw error
      throw new InternalServerErrorException(
        'Barberni yangilashda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const barber = await this.findOne(id);
      if (!barber) throw new NotFoundException('Barber topilmadi');
      await this.barberRepository.remove(barber);
      return { message: 'Barber o`chirildi' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Barberni o`chirishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }
}
