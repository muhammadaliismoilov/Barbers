import { ApiProperty, PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import {  IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from '../user.entity';
import { Type } from 'class-transformer';

export class NearbyBarbersDto{
  @ApiProperty({example:41.551070, description:`Latitude koordinatasi`})
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({example: 60.605706, description:`Longitude koordinatasi`})
  @Type(() => Number)
  @IsNumber()
  lng: number;
  
  @ApiProperty({example:3, description:`Radius(km)`,default:3, required: false })
  @Type(()=> Number)
  @IsNumber()
  @IsOptional()
  radius?:number

}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'Telefon raqami (unikal)',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'newPassword123', description: 'Parol' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: 'User ro`lini o`zgartrish',
    description: 'User ro`lini o`zgartirish  uchun',
  })
  @IsOptional()
  @IsString({ each: true })
  role?: Role[];

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
