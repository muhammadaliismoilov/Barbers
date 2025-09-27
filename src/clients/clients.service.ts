import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(BarberService)
    private readonly barberServiceRepo: Repository<BarberService>,
  ) {}

  async create(dto: CreateClientDto) {
    try {
      // barber service mavjudligini tekshirish
      const barberService = await this.barberServiceRepo.findOne({
        where: { id: dto.barberServiceId },
      });

      if (!barberService)
        throw new NotFoundException(
          `Barber service topilmadi (id: ${dto.barberServiceId})`,
        );

      // 🔎 Sana + vaqt bo‘yicha mavjudligini tekshirish
      const exists = await this.clientRepo.findOne({
        where: {
          appointmentDate: dto.appointmentDate,
          appointmentTime: dto.appointmentTime,
          barberService: { id: barberService.id },
        },
        relations: ['barberService'],
      });

      if (exists) {
        throw new ConflictException(
          `Bu vaqt (${dto.appointmentDate} ${dto.appointmentTime}) allaqachon band qilingan!`,
        );
      }

      // client yaratish
      const client = this.clientRepo.create({
        name: dto.name,
        phone: dto.phone,
        appointmentDate: dto.appointmentDate,
        appointmentTime: dto.appointmentTime,
        description: dto.description,
        barberServiceId: dto.barberServiceId, // ✅ endi string id ishlaydi
      });

      return await this.clientRepo.save(client);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Mijoz qo‘shishda serverda xatolik yuz berdi',
      );
    }
  }

  async findAll() {
  try {
    return await this.clientRepo.find({
      relations: ['barberService'], // ✅ har doim xizmatni ham qaytarsin
      order: { createdAt: 'DESC' },
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Mijozlarni olishda serverda xatolik yuz berdi',
    );
  }
}

async findOne(id: string) {
  try {
    const client = await this.clientRepo.findOne({
      where: { id },
      relations: ['barberService'],
    });

    if (!client) {
      throw new NotFoundException(`Mijoz topilmadi (id: ${id})`);
    }

    return client;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(
      'Mijozni olishda serverda xatolik yuz berdi',
    );
  }
}

async update(id: string, dto: UpdateClientDto) {
  try {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Mijoz topilmadi (id: ${id})`);
    }

    // Agar xizmat ID kelgan bo‘lsa tekshiramiz
    if (dto.barberService) {
      const barberService = await this.barberServiceRepo.findOne({
        where: { id: dto.barberService },
      });

      if (!barberService) {
        throw new NotFoundException(
          `Barber service topilmadi (id: ${dto.barberService})`,
        );
      }

      client.barberService = barberService;
    }

    // qolgan fieldlarni yangilash
    Object.assign(client, dto);

    return await this.clientRepo.save(client);
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(
      'Mijozni yangilashda serverda xatolik yuz berdi',
    );
  }
}

async remove(id: string) {
  try {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Mijoz topilmadi (id: ${id})`);
    }

    await this.clientRepo.remove(client);
    return { message: 'Mijoz muvaffaqiyatli o‘chirildi' };
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(
      'Mijozni o‘chirishda serverda xatolik yuz berdi',
    );
  }
}

}
