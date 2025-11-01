import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from './client.entity';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { UsersInfo } from 'src/users_info/users_info.entity';
import { BarberClientGateway } from 'src/webSocket/barber-client.gateway';

@Processor('clients')
export class ClientsProcessor {
  private readonly logger = new Logger(ClientsProcessor.name);

  constructor(
    @InjectRepository(Clients)
    private readonly clientRepo: Repository<Clients>,
    @InjectRepository(UsersInfo)
    private readonly barberRepo: Repository<UsersInfo>,
    @InjectRepository(BarberServices)
    private readonly barberServiceRepo: Repository<BarberServices>,
    private readonly gateway: BarberClientGateway, // E'tibor: gateway modulda provider bo'lishi kerak
  ) {}

  @Process('create-client')
  async handleCreateClient(job: Job) {
    const dto = job.data;
    this.logger.debug(
      `🧾 [jobId=${job.id}] Client yaratish boshlandi: ${dto.fullName}`,
    );
    // this.logger.debug(`🧾 [jobId=${job.id}] attemptsMade=${job.attemptsMade}, timestamp=${new Date().toISOString()}`);

    try {
      // === 1. Barber tekshiruv ===
      const barber = await this.barberRepo.findOne({
        where: { id: dto.barberId },
      });
      if (!barber) {
        // this.logger.warn(`[jobId=${job.id}] Barber topilmadi: ${dto.barberId}`);
        throw new NotFoundException('Barber topilmadi');
      }

      // === 2. Barber service tekshiruv ===
      const barberService = await this.barberServiceRepo.findOne({
        where: { id: dto.barberServiceId },
      });
      if (!barberService) {
        // this.logger.warn(`[jobId=${job.id}] Barber service topilmadi: ${dto.barberServiceId}`);
        throw new NotFoundException(
          `Xizmat turi topilmadi (id: ${dto.barberServiceId})`,
        );
      }

      // === 3. Sana va vaqt validatsiyasi ===
      const isValidDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        const [y, m, d] = dateString.split('-').map(Number);
        return (
          date.getUTCFullYear() === y &&
          date.getUTCMonth() + 1 === m &&
          date.getUTCDate() === d
        );
      };
      const isValidTime = (timeString: string) => {
        const [hh, mm] = timeString.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return false;
        return hh >= 0 && hh < 24 && mm >= 0 && mm < 60;
      };

      if (!isValidDate(dto.appointmentDate)) {
        // this.logger.warn(`[jobId=${job.id}] Noto'g'ri sana: ${dto.appointmentDate}`);
        throw new BadRequestException('Noto‘g‘ri sana kiritildi!');
      }
      if (!isValidTime(dto.appointmentTime)) {
        // this.logger.warn(`[jobId=${job.id}] Noto'g'ri vaqt: ${dto.appointmentTime}`);
        throw new BadRequestException('Noto‘g‘ri vaqt kiritildi!');
      }

      // === 4. Band bo'lgan vaqtni tekshirish ===
      const exists = await this.clientRepo.findOne({
        where: {
          appointmentDate: dto.appointmentDate,
          appointmentTime: dto.appointmentTime,
        },
      });
      if (exists) {
        // this.logger.warn(`[jobId=${job.id}] Bu vaqt allaqachon band: ${dto.appointmentDate} ${dto.appointmentTime}`);
        throw new ConflictException(
          `Bu vaqt (${dto.appointmentDate} ${dto.appointmentTime}) allaqachon band qilingan!`,
        );
      }

      // === 5. Client yaratish va saqlash ===
      const client = this.clientRepo.create({ ...dto });
      this.logger.debug(
        `[jobId=${job.id}] client to be saved: ${JSON.stringify(client)}`,
      );

      const saved = await this.clientRepo.save(client);
      // this.logger.log(`[jobId=${job.id}] ✅ Client saqlandi: id=${saved.id}, name=${saved.fullName}`);

      // === 6. Gateway orqali signal yuborish — xavfsiz chaqirish (try/catch) ===
      // try {
      //   if (this.gateway && typeof this.gateway.clientAdded === 'function') {
      //     this.gateway.clientAdded(saved);
      //     this.logger.debug(`[jobId=${job.id}] Gatewayga signal yuborildi`);
      //   } else {
      //     this.logger.warn(`[jobId=${job.id}] Gateway mavjud emas yoki method topilmadi`);
      //   }
      // } catch (gwErr) {
      //   // Gateway xatosi butun jobni muvaffaqiyatsiz qilmasligi uchun loglab davom etamiz
      //   this.logger.error(`[jobId=${job.id}] Gateway error: ${gwErr?.message || gwErr}`, gwErr?.stack);
      // }
      return saved;
    } catch (error) {
      // Batafsil log — nimani qaytarmoqdamiz
      this.logger.error(
        `[jobId=${job.id}] Xatolik: ${error?.message || error}`,
        error?.stack,
      );
      if (error instanceof HttpException) {
        throw {
          isCustom: true,
          status: error.getStatus(),
          message: error.message,
        };
      }

      throw {
        isCustom: true,
        status: 500,
        message: 'Job bajarishda ichki xatolik',
      };
    }
  }
}
