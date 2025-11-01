import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/users/user.entity';
import { UsersInfo } from './users_info.entity';
import { CreateUsersInfoDto, UpdateUsersInfoDto } from './dto/users_info.dto';

@Injectable()
export class UsersInfoService {
  constructor(
    @InjectRepository(UsersInfo)
    private readonly usersInfoRepo: Repository<UsersInfo>,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  // 🧩 CREATE
  async create(dto: CreateUsersInfoDto) {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Bunday user topilmadi');

    const newInfo = this.usersInfoRepo.create({
      ...dto,
      userId: user,
    });

    return this.usersInfoRepo.save(newInfo);
  }

  // 🧩 FIND ALL
async findAll() {
 try {
   const data = await this.usersInfoRepo.find({
    relations: ['userId'],
    order: { createdAt: 'DESC' },
  });

  return data.map(item => ({
    ...item,
    userId: item.userId?.id, // faqat id qiymatini olamiz
  }));
 } catch (error) {
  throw new InternalServerErrorException('Barcha barrberlar ma`lumotlarini olishda serverda xtolik yuz berdi')
 }
}


  // 🧩 FIND ONE
  async findOne(id: string) {
    try {
      const info = await this.usersInfoRepo.findOne({
      where: { id },
      relations: ['userId'], select: { userId: { id: true } },
    });
    if (!info) throw new NotFoundException('User ma’lumoti topilmadi');
    return info;
    } catch (error) {
      throw new InternalServerErrorException("Bitta barber malumotlarini olishda serverda xatolik yu berdi")
    }
  }

  // 🧩 UPDATE
  async update(id: string, dto: UpdateUsersInfoDto) {
    const info = await this.usersInfoRepo.findOne({ where: { id } });
    if (!info) throw new NotFoundException('Yangilanish uchun ma’lumot topilmadi');

    Object.assign(info, dto);
    return this.usersInfoRepo.save(info);
  }

  // 🧩 DELETE
  async remove(id: string) {
    const info = await this.usersInfoRepo.findOne({ where: { id } });
    if (!info) throw new NotFoundException('O‘chirish uchun ma’lumot topilmadi');
    return this.usersInfoRepo.remove(info);
  }
}
