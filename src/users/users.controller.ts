import { Controller, Get, Param, Put, Delete, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from './user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NearbyBarbersDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('barbers/nearby')
  @ApiOperation({
    summary: 'Yaqin atrofdagi sartaroshlarni olish',
    description:
      'Foydalanuvchi joylashuvi (latitude, longitude) va radius (km) bo‘yicha eng yaqin barberlarni qaytaradi.',
  })
  @ApiResponse({
    status: 200,
    description: 'Yaqin atrofdagi sartaroshlar ro‘yxati muvaffaqiyatli qaytarildi.',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Latitude yoki Longitude noto‘g‘ri formatda kiritilgan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Berilgan koordinatalar bo‘yicha sartaroshlar topilmadi.',
  })
  async getNearbyBarbers(
    @Query() dto: NearbyBarbersDto,
  ): Promise<User[]> {
    return this.usersService.getBarbersNearby(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro‘yxati'})
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  @ApiResponse({ status: 200, description: 'Topilgan foydalanuvchi' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan foydalanuvchi' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
