import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
}
