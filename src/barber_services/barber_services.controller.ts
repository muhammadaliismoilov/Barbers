import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BarberServicesService } from './barber_services.service';
import { CreateBarberServiceDto, UpdateBarberServiceDto } from './dto/barber_service.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt.aut.guard';
import { Roles } from 'src/common/guard/roles.decarator';

@ApiBearerAuth('JWT-auth')
@ApiTags('barber_services')
@Controller('barber_services')
// @UseGuards(JwtAuthGuard, RolesGuard) 
export class BarberServicesController {
  constructor(private readonly barberServicesService: BarberServicesService) {}

  @Post()
  // @Roles( 'barber', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Yangi xizmat qo‘shish' })
  @ApiResponse({ status: 201, description: 'Xizmat muvaffaqiyatli qo‘shildi'} )
  async create(@Body() dto: CreateBarberServiceDto) {
    return this.barberServicesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha xizmatlarni olish' })
  @ApiResponse({ status: 200, description: 'Xizmatlar ro‘yxati'})
  async findAll() {
    return this.barberServicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha xizmatni olish' })
  @ApiParam({ name: 'id', type: 'string', description: 'Xizmat IDsi' })
  @ApiResponse({ status: 200, description: 'Xizmat topildi' })
  async findOne(@Param('id') id: string) {
    return this.barberServicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Xizmatni yangilash' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Xizmat yangilandi' })
  async update(@Param('id') id: string, @Body() dto: UpdateBarberServiceDto) {
    return this.barberServicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xizmatni o‘chirish' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Xizmat muvaffaqiyatli o‘chirildi' })
  async remove(@Param('id') id: string) {
    return this.barberServicesService.remove(id);
  }
}
