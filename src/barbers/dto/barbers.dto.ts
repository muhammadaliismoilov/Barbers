import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsPhoneNumber, IsInt, IsBoolean, IsOptional, MinLength, IsNumber } from 'class-validator';

export class CreateBarberDto {
  @ApiProperty({ example: 'Ali ', description: 'Barber to‘liq ismi' })
  @IsNotEmpty({ message: 'To‘liq ism majburiy' })
  @IsString({ message: 'To‘liq ism matn bo‘lishi kerak' })
  fullName: string;

  @ApiProperty({ example: '+998901234567', description: 'Barber telefon raqami (unikal)' })
  @IsNotEmpty({ message: 'Telefon raqam majburiy' })
  @IsPhoneNumber('UZ', { message: 'Telefon raqam noto‘g‘ri formatda' })
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Parol (kamida 6 ta belgidan iborat)' })
  @IsNotEmpty({ message: 'Parol majburiy' })
  @IsString({ message: 'Parol matn bo‘lishi kerak' })
  @MinLength(6, { message: 'Parol kamida 6 belgidan iborat bo‘lishi kerak' })
  password: string;

  @ApiProperty({ example: 'Soch olish va soqol olish xizmatlari', description: 'Barber haqida qisqacha ma’lumot', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5, description: 'Tajriba yillari', required: false })
  @IsOptional()
  @IsInt({ message: 'Tajriba raqam bo‘lishi kerak' })
  experienceYears?: number;

  @ApiProperty({ example: '09:00 - 20:00', description: 'Ish vaqti', required: false })
  @IsOptional()
  @IsString()
  workHours?: string;

  @ApiProperty({ example: true, description: 'Faollik holati', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 41.311081, description: 'Latitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
   @IsOptional()
  lat?: number;

  @ApiProperty({ example: 69.240562, description: 'Longitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
   @IsOptional()
  long?: number;
}



export class UpdateBarberDto  {
  @ApiPropertyOptional({ example: 'Vali Karimov', description: 'Barber to‘liq ismi' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998909876543', description: 'Barber telefon raqami (unikal)' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({ example: 'NewPassword123', description: 'Yangi parol' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'Professional barber', description: 'Qisqacha ma’lumot' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 10, description: 'Tajriba yillari' })
  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @ApiPropertyOptional({ example: '10:00 - 22:00', description: 'Ish vaqti' })
  @IsOptional()
  @IsString()
  workHours?: string;

  @ApiPropertyOptional({ example: false, description: 'Faollik holati' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  @ApiProperty({ example: 41.311081, description: 'Latitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
   @IsOptional()
  lat?: number;

  @ApiProperty({ example: 69.240562, description: 'Longitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
   @IsOptional()
  long?: number;
}
