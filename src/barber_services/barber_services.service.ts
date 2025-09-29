import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberService } from './barber_service.entity';
import {
  CreateBarberServiceDto,
  UpdateBarberServiceDto,
} from './dto/barber_service.dto';
import { Barber } from 'src/barbers/barber.entity';

@Injectable()
export class BarberServicesService {
  constructor(
    @InjectRepository(BarberService)
    private readonly barberServiceRepo: Repository<BarberService>,
    @InjectRepository(Barber)
    private readonly barberRepo: Repository<Barber>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateBarberServiceDto) {
  try {
    // Barberni tekshirish
    const barber = await this.barberRepo.findOne({ where: { id: dto.barberId } });
    if (!barber) throw new NotFoundException('Berilgan barber topilmadi');

    // Title uniqueness tekshirish
    const existingService = await this.barberServiceRepo.findOne({
      where: { title: dto.title },
    });
    if (existingService) throw new ConflictException('Bu xizmat mavjud!');

    // Xizmat yaratish
    const service = this.barberServiceRepo.create({
      ...dto,
      barber, // barber obyektini bog‘lash
    });

    return await this.barberServiceRepo.save(service);
  } catch (error) {
    if (error instanceof ConflictException || error instanceof NotFoundException) throw error;

    throw new InternalServerErrorException(
      'Xizmat qo‘shishda serverda xatolik yuz berdi',
      error.message,
    );
  }
}


  // ✅ FIND ALL
  async findAll(): Promise<BarberService[]> {
    try {
      return await this.barberServiceRepo.find({
        relations: ['barber'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Xizmatlarni olishda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // ✅ FIND ONE
  async findOne(id: string): Promise<BarberService> {
    try {
      const service = await this.barberServiceRepo.findOne({
        where: { id },
        relations: ['barber'],
      });
      if (!service) {
        throw new NotFoundException(`ID=${id} bo‘lgan xizmat topilmadi`);
      }
      return service;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Xizmatni olishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // ✅ UPDATE
  async update(
    id: string,
    dto: UpdateBarberServiceDto,
  ): Promise<BarberService> {
    try {
      const service = await this.findOne(id);
      if (!service)
        throw new NotFoundException(`ID=${id} bo‘lgan xizmat topilmadi`);
      Object.assign(service, dto);
      return await this.barberServiceRepo.save(service);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Xizmatni yangilashda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // ✅ DELETE
  async remove(id: string): Promise<{ message: string }> {
    try {
      const service = await this.findOne(id);
      if (!service)
        throw new NotFoundException(`ID=${id} bo‘lgan xizmat topilmadi`);
      await this.barberServiceRepo.remove(service);
      return { message: 'Xizmat muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Xizmatni o‘chirishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }
}
