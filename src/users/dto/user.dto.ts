import { ApiProperty, PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { Role } from '../user.entity';
import { Type } from 'class-transformer';

export class NearbyBarbersDto {
  @ApiProperty({ example: 41.55107, description: `Latitude koordinatasi` })
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 60.605706, description: `Longitude koordinatasi` })
  @Type(() => Number)
  @IsNumber()
  lng: number;

  @ApiProperty({
    example: 3,
    description: `Radius(km)`,
    default: 3,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  radius?: number;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: Role.ADMIN,
    description: 'Qo‘shiladigan yoki o‘chiriladigan rol nomi',
    enum: Role,
  })
  @IsEnum(Role, {
    message: 'role faqat superadmin ,admin , barber va user, qiymatlaridan biri bo‘lishi kerak', 
  })
  role: Role;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: '998901234567',
    description: 'Foydalanuvchi telefon raqami (faqat raqamlar)',
  })
  @IsString({ message: 'Telefon raqami matn (string) bo‘lishi kerak' })
  @Matches(/^[0-9]{9,15}$/, {
    message:
      'Telefon raqami faqat raqamlardan iborat bo‘lishi kerak (9–15 ta raqam)',
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'newPassword123', description: 'Parol' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 41.311081, description: 'Latitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiProperty({ example: 69.240562, description: 'Longitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lng?: number;
}
