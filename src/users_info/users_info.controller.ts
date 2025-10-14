import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersInfoService } from './users_info.service';
import { CreateUsersInfoDto, UpdateUsersInfoDto } from './dto/users_info.dto';

@ApiTags('User Info (Barber qo‘shimcha ma’lumotlari)')
@Controller('user-info')
export class UsersInfoController {
  constructor(private readonly usersInfoService: UsersInfoService) {}

  // 🧩 CREATE
  @Post()
  @ApiOperation({ summary: 'Yangi barber ma’lumotini yaratish' })
  @ApiResponse({ status: 201, description: 'Yaratildi' })
  async create(@Body() dto: CreateUsersInfoDto) {
    return this.usersInfoService.create(dto);
  }

  // 🧩 FIND ALL
  @Get()
  @ApiOperation({ summary: 'Barcha barber ma’lumotlarini olish' })
  async findAll() {
    return this.usersInfoService.findAll();
  }

  // 🧩 FIND ONE
  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha barber ma’lumotini olish' })
  async findOne(@Param('id') id: string) {
    return this.usersInfoService.findOne(id);
  }

  // 🧩 UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Barber ma’lumotini yangilash' })
  async update(@Param('id') id: string, @Body() dto: UpdateUsersInfoDto) {
    return this.usersInfoService.update(id, dto);
  }

  // 🧩 DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Barber ma’lumotini o‘chirish' })
  async remove(@Param('id') id: string) {
    return this.usersInfoService.remove(id);
  }
}
