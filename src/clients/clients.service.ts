import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { Repository } from 'typeorm';
import { Client, ClientStatus } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { Barber } from 'src/barbers/barber.entity';
import { BarberClientGateway } from 'src/webSocket/barber-client.gateway';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    private readonly gateway: BarberClientGateway,
    @InjectRepository(BarberService)
    private readonly barberServiceRepo: Repository<BarberService>,
    @InjectRepository(Barber)
    private readonly barberRepo: Repository<Barber>,
  ) {}

  async updateStatus(id: string, status: ClientStatus) {
    const client = await this.clientRepo.findOne({
      where: { id },
      relations: ['barber', 'barberService'], // barber va barberService ni ham chaqirib olamiz
    });

    if (!client) throw new NotFoundException('Mijoz topilmadi');

    client.status = status;
    await this.clientRepo.save(client);

    // ✅ Agar status COMPLETED bo'lsa, barberning umumiy daromadiga qo‘shib boramiz
    if (status === ClientStatus.COMPLETED) {
      if (client.barber && client.barberService) {
        client.barber.totalSum =
          (client.barber.totalSum || 0) + client.barberService.price;

        await this.barberRepo.save(client.barber);
      }
    }

    // ✅ WebSocket orqali xabar berish
    this.gateway.statusChanged(client.id, status);

    return client;
  }

  async create(dto: CreateClientDto) {
    try {
      // barber service mavjudligini tekshirish
      const barber = await this.barberRepo.findOne({
        where: { id: dto.barberId },
      });
      if (!barber) throw new NotFoundException('Barber topilmadi');

      const barberService = await this.barberServiceRepo.findOne({
        where: { id: dto.barberServiceId },
      });

      if (!barberService)
        throw new NotFoundException(
          `Xizmat turi topilmadi (id: ${dto.barberServiceId})`,
        );

      function isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;

        const [y, m, d] = dateString.split('-').map(Number);
        return (
          date.getUTCFullYear() === y &&
          date.getUTCMonth() + 1 === m &&
          date.getUTCDate() === d
        );
      }

      function isValidTime(timeString: string): boolean {
        const [hh, mm] = timeString.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return false;

        return hh >= 0 && hh < 24 && mm >= 0 && mm < 60;
      }
      if (!isValidDate(dto.appointmentDate))
        throw new BadRequestException(
          'appointmentDate noto‘g‘ri sana kiritildi!',
        );
      if (!isValidTime(dto.appointmentTime))
        throw new BadRequestException(
          'appointmentTime noto‘g‘ri vaqt kiritildi!',
        );

      // 🔎 Sana + vaqt bo‘yicha mavjudligini tekshirish
      const exists = await this.clientRepo.findOne({
        where: {
          appointmentDate: dto.appointmentDate,
          appointmentTime: dto.appointmentTime,
        },
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
        barberId: dto.barberId,
        barberServiceId: dto.barberServiceId,
        // barber: barber,
        // barberService: barberService,
      });

      this.gateway.clientAdded(client);

      return await this.clientRepo.save(client);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ConflictException) throw error;
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);

      throw new InternalServerErrorException(
        'Mijoz qo‘shishda serverda xatolik yuz berdi',
      );
    }
  }

  async findAll() {
    try {
      return await this.clientRepo.find({});
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
        // relations: ['barberService', 'barber'],
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
