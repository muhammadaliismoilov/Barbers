import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberServices } from './barber_service.entity';
import {
  CreateBarberServiceDto,
  UpdateBarberServiceDto,
} from './dto/barber_service.dto';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Injectable()
export class BarberServicesService {
  constructor(
    @InjectRepository(BarberServices)
    private readonly barberServiceRepo: Repository<BarberServices>,
    @InjectRepository(UsersInfo)
    private readonly barberRepo: Repository<UsersInfo>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateBarberServiceDto): Promise<BarberServices> {
    try {
      // Barberni tekshirish
      const barber = await this.barberRepo.findOne({
        where: { id: dto.barberId },
      });
      if (!barber) throw new NotFoundException('Berilgan barber topilmadi');

      // Title uniqueness tekshirish
      const existingService = await this.barberServiceRepo.findOne({
        where: { title: dto.title },
      });
      if (existingService) throw new ConflictException('Bu xizmat mavjud!');

      // Xizmat yaratish
      const service = this.barberServiceRepo.create({
        ...dto,
        // barber: barber, // barber obyektini bog‘lash
      });

      return await this.barberServiceRepo.save(service);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Xizmat qo‘shishda serverda xatolik yuz berdi',
        // error.message,
      );
    }
  }

  // ✅ FIND ALL
  async findAll(): Promise<BarberServices[]> {
    try {
      return await this.barberServiceRepo.find({});
    } catch (error) {
      throw new InternalServerErrorException(
        'Xizmatlarni olishda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // ✅ FIND ONE
  async findOne(id: string): Promise<BarberServices> {
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
  ): Promise<BarberServices> {
    try {
      const service = await this.findOne(id);
      if (!service)
        throw new NotFoundException(`ID=${id} bo‘lgan xizmat topilmadi`);
      for (const [key, value] of Object.entries(dto)) {
        if (value !== undefined && value !== null && value !== '') {
          (service as any)[key] = value;
        }
      }
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
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Xizmatni o‘chirishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }
}
