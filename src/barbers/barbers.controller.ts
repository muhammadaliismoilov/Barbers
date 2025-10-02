import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { Barber } from './barber.entity';
import { CreateBarberDto, UpdateBarberDto } from './dto/barbers.dto';

@ApiTags('Barbers')
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi barber qo‘shish' })
  @ApiResponse({ status: 201, description: 'Barber muvaffaqiyatli qo‘shildi', type: Barber })
  @ApiResponse({ status: 409, description: 'Bu telefon raqam allaqachon mavjud' })
  async create(@Body() dto: CreateBarberDto): Promise<Barber> {
    return this.barbersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha barberlarni olish' })
  @ApiResponse({ status: 200, description: 'Barberlar ro‘yxati', type: [Barber] })
  async findAll(): Promise<Barber[]> {
    return this.barbersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta barberni olish' })
  @ApiResponse({ status: 200, description: 'Topilgan barber', type: Barber })
  @ApiResponse({ status: 404, description: 'Barber topilmadi' })
  async findOne(@Param('id') id: string): Promise<Barber> {
    return this.barbersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Barber ma’lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Barber muvaffaqiyatli yangilandi', type: Barber })
  @ApiResponse({ status: 404, description: 'Barber topilmadi' })
  async update(@Param('id') id: string, @Body() dto: UpdateBarberDto): Promise<Barber> {
    return this.barbersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Barberni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Barber muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Barber topilmadi' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.barbersService.remove(id);
  }
}
