import { Controller, Get, Param, Put, Delete, Body, Query, Patch, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

import { Users } from './user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NearbyBarbersDto, UpdateRoleDto, UpdateUserDto } from './dto/user.dto';
import { TransformInterceptor } from 'src/common/interseptors/transform.interceptor';

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
    type: [Users],
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
  ): Promise<Users[]> {
    return this.usersService.getBarbersNearby(dto);
  }

  @Get()
  // @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro‘yxati'})
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
    // @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  @ApiResponse({ status: 200, description: 'Topilgan foydalanuvchi' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }


  // 🧩 ROLE QO‘SHISH
  @Patch(':id/add-role')
  @ApiOperation({ summary: 'Foydalanuvchiga yangi rol qo‘shish (masalan: admin, barber)' })
  @ApiResponse({ status: 200, description: 'Rol muvaffaqiyatli qo‘shildi' })
  async addRole(@Param('id') id:string, @Body()dto: UpdateRoleDto) {
    return this.usersService.addRole(id,dto);
  }

  // 🧩 ROLE O‘CHIRISH
  @Patch(':id/remove-role')
  @ApiOperation({ summary: 'Foydalanuvchidan rolni olib tashlash (masalan: admin yoki barber)' })
  @ApiResponse({ status: 200, description: 'Rol muvaffaqiyatli o‘chirildi' })
  async removeRole(@Param('id') id :string,@Body() dto: UpdateRoleDto) {
    return this.usersService.removeRole(id,dto);
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
