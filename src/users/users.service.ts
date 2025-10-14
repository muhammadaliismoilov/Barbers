import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Users } from './user.entity';
import { NearbyBarbersDto, UpdateRoleDto, UpdateUserDto } from './dto/user.dto';
import { BarberServices } from 'src/barber_services/barber_service.entity';
import { Client } from 'pg';
import { CreateClientDto } from 'src/clients/dto/client.dto';
import { UsersInfo } from 'src/users_info/users_info.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(UsersInfo)
    private readonly barberRepo: Repository<UsersInfo>,
    @InjectRepository(BarberServices)
    private readonly barberServiceRepo: Repository<BarberServices>,
  ) {}


 async addRole(id:string,dto: UpdateRoleDto) {

    const { role } = dto;

    const user = await this.userRepo.findOne({where:{id} });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    // Agar userda rol allaqachon mavjud bo‘lsa
    if (user.role.includes(role)) {
      throw new BadRequestException(`Foydalanuvchida "${role}" roli allaqachon mavjud`);
    }

    user.role.push(role);
    return this.userRepo.save(user);
  }

  // 🧩 ROLE O‘CHIRISH
  async removeRole(id:string, dto: UpdateRoleDto) {
    const {  role } = dto;

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    // Agar userda bunday rol bo‘lmasa
    if (!user.role.includes(role)) {
      throw new BadRequestException(`Foydalanuvchida "${role}" roli yo‘q`);
    }

    // Rolni olib tashlaymiz
    user.role = user.role.filter((r) => r !== role);

    // ⚠️ Hech bo‘lmaganda bitta rol qolishi kerak
    if (user.role.length === 0) {
      user.role = [Role.USER]; // default user rolini qoldiramiz
    }

    return this.userRepo.save(user);
  }

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
        relations: ['userInfo'],
      });

      if (!user) {
        throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
      }

      return user;
    } catch (error) {
      console.log(error);
      
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
           cos(radians(:lat)) * cos(radians("u"."lat")) *
           cos(radians("u"."lng") - radians(:lng)) +
           sin(radians(:lat)) * sin(radians("u"."lat"))
         )) AS numeric ), 2 )`;

      // So‘rov
      const barbers = await this.barberRepo
        .createQueryBuilder('barbers')
        .innerJoin('barbers.userId', 'u')
        .select([
          '"u"."fullName" AS name',
          '"u"."phone" AS phone',
          '"barbers"."workHours" AS workingHours',
          '"barbers"."experienceYears" AS experienceYears',
          '"barbers"."description" AS description',
          '"u"."lat" AS lat',
          '"u"."lng" AS lng',
          '"barbers"."isActive" AS isActive',
        ])
        .addSelect(distance, 'distance')
        .where(`${distance} < :radius`, { lat, lng, radius: searchRadius })
        .andWhere('"barbers"."isActive" = :isActive', { isActive: true }) // ✅ to‘g‘rilandi
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
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      
      throw new InternalServerErrorException(
        'Yaqin atrofdagi barberlarni olishda xatolik yuz berdi',
      );
    }
  }
}
