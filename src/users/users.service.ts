import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NearbyBarbersDto, UpdateUserDto } from './dto/user.dto';
import { Barber } from 'src/barbers/barber.entity';
import { BarberService } from 'src/barber_services/barber_service.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Barber)
    private readonly barberRepo: Repository<Barber>,
    @InjectRepository(BarberService)
    private readonly barberServiceRepo: Repository<BarberService>,
  ) {}

  async findAll() {
    try {
      return await this.userRepo.find({
        // relations: ['barber'], // barber bilan join qilinadi
      });
    } catch (error) {
      console.log(error.message);

      throw new InternalServerErrorException(
        'Foydalanuvchilarni olishda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        relations: ['barber'],
      });

      if (!user) {
        throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Foydalanuvchini olishda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
      }

      for (const [key, value] of Object.entries(dto)) {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'role') {
            // agar string bo‘lsa arrayga o‘ramiz
            const newRoles = Array.isArray(value) ? value : [value];

            // eski ro‘llarni saqlab, yangilarni qo‘shamiz (dublikatlarni oldini olamiz)
            const mergedRoles = Array.from(
              new Set([...(user.role || []), ...newRoles]),
            );

            (user as any)[key] = mergedRoles;
          } else {
            (user as any)[key] = value;
          }
        }
      }

      return await this.userRepo.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Foydalanuvchini yangilashda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
      }

      await this.userRepo.remove(user);
      return { message: `Foydalanuvchi muvaffaqiyatli o‘chirildi (id: ${id})` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Foydalanuvchini o‘chirishda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async getBarbersNearby(dto: NearbyBarbersDto) {
    try {
      const { lat, lng, radius } = dto;

      // radius km da kiritiladi
      const searchRadius = radius && !isNaN(+radius) ? +radius : 1;

      // Kiritilgan koordinatalarni tekshirish
      if (isNaN(lat) || isNaN(lng)) {
        throw new BadRequestException(
          'Latitude yoki longitude noto‘g‘ri formatda kiritilgan',
        );
      }

      // Haversine formula (km)
      const distance = `ROUND(CAST(
         (6371 * acos(
           cos(radians(:lat)) * cos(radians(barbers.lat)) *
           cos(radians(barbers.lng) - radians(:lng)) +
           sin(radians(:lat)) * sin(radians(barbers.lat))
         )) AS numeric ), 2 )`;

      // So‘rov
      const barbers = await this.barberRepo
        .createQueryBuilder('barbers')
        .select([
          'barbers.fullName AS name',
          'barbers.phone AS phone',
          'barbers.workHours AS workingHours',
          'barbers.experienceYears AS experienceYears',
          'barbers.description AS description',
          'barbers.lat AS lat',
          'barbers.lng AS lng',
          'barbers.isActive AS isActive',
        ])
        .addSelect(distance, 'distance')
        .where(`${distance} < :radius`, { lat, lng, radius: searchRadius })
        .andWhere('barbers.isActive = :isActive', { isActive: true }) // ✅ to‘g‘rilandi
        .orderBy('distance', 'ASC')
        .getRawMany();

      // Agar sartarosh topilmasa
      if (!barbers.length) {
        throw new NotFoundException(
          'Berilgan koordinatalar bo‘yicha sartaroshlar topilmadi',
        );
      }

      return barbers;
    } catch (error) {
      console.error('getBarbersNearby error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Yaqin atrofdagi barberlarni olishda xatolik yuz berdi',
      );
    }
  }
}
