import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';


@ApiTags('clients') // Swagger bo‘limi nomi
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi mijoz qo‘shish' })
  @ApiResponse({ status: 201, description: 'Mijoz muvaffaqiyatli qo‘shildi'})
  @ApiResponse({ status: 404, description: 'Barber service topilmadi' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha mijozlarni olish' })
  @ApiResponse({ status: 200, description: 'Mijozlar ro‘yxati' })
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha mijozni olish' })
  @ApiResponse({ status: 200, description: 'Mijoz topildi'})
  @ApiResponse({ status: 404, description: 'Mijoz topilmadi' })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }
 
  @Patch(':id')
  @ApiOperation({ summary: 'Mijoz ma’lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Mijoz muvaffaqiyatli yangilandi'})
  @ApiResponse({ status: 404, description: 'Mijoz yoki barber service topilmadi' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mijozni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Mijoz muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Mijoz topilmadi' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
