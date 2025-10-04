import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Client, ClientStatus } from '../clients/client.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(BarberService)
    private barberServiceRepo: Repository<BarberService>,
  ) {}
async getDailyReport(date?: string): Promise<ReportDto> {
  try {
    // ✅ Agar date berilmagan bo‘lsa, bir kun oldingi sanani olamiz
    let targetDate: Date;
    if (!date) {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - 1); // kechagi kun
    } else {
      targetDate = new Date(date);
    }

    const start = new Date(targetDate);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    // --- Jami mijozlar va tugallanganlar
    const clients = await this.clientRepo.find({
      where: { createdAt: Between(start, end) },
      relations: ['barberService'],
    });

    const totalClients = clients.length;
    const completedClients = clients.filter(
      (c) => c.status === ClientStatus.COMPLETED,
    ).length;

    // --- Daromad hisoblash
    const dailyIncome = clients.reduce(
      (sum, c) => sum + (c.barberService ? c.barberService.price : 0),
      0,
    );
    const averagePrice = totalClients > 0 ? dailyIncome / totalClients : 0;

    // --- Xizmatlar bo‘yicha
    const servicesBy = clients.reduce((acc, c) => {
      if (!c.barberService) return acc;
      const found = acc.find((s) => s.service === c.barberService.title);
      if (found) {
        found.count += 1;
        found.income += c.barberService.price;
      } else {
        acc.push({
          service: c.barberService.title,
          count: 1,
          income: c.barberService.price,
        });
      }
      return acc;
    }, [] as { service: string; count: number; income: number }[]);

    // --- Soatlar bo‘yicha
    const hoursBy = clients.reduce((acc, c) => {
      const hour = new Date(c.createdAt).getHours() + ':00';
      const found = acc.find((h) => h.hour === hour);
      if (found) {
        found.clients += 1;
        found.income += c.barberService ? c.barberService.price : 0;
      } else {
        acc.push({
          hour,
          clients: 1,
          income: c.barberService ? c.barberService.price : 0,
        });
      }
      return acc;
    }, [] as { hour: string; clients: number; income: number }[]);

    return {
      dailyIncome,
      totalClients,
      completedClients,
      averagePrice,
      servicesBy,
      hoursBy,
    };
  } catch (error) {
    throw new InternalServerErrorException(
      'Xisobotlarni olishda serverda xatolik yuz berdi',
      error.message,
    );
  }
}

}
