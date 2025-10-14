import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsUUID,
  IsDateString,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ClientStatus } from '../client.entity';

export class UpdateClientStatusDto {
  @ApiProperty({
    example: ClientStatus.PROGRESS,
    description: 'Mijozning yangi holati',
    enum: ClientStatus,
  })
  @IsEnum(ClientStatus, {
    message: 'status faqat: pending | progress | completed bo‘lishi kerak',
  })
  status: ClientStatus;
}

export class CreateClientDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Mijozning to‘liq ismi' })
  @IsNotEmpty({ message: 'Ism bo‘sh bo‘lishi mumkin emas' })
  @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
  fullName: string;

  @ApiProperty({
    example: '998901234567',
    description: 'Foydalanuvchi telefon raqami (faqat raqamlar)',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi kerak' })
  @IsString({ message: 'Telefon raqami matn (string) bo‘lishi kerak' })
  @Matches(/^[0-9]{9,15}$/, {
    message:
      'Telefon raqami faqat raqamlardan iborat bo‘lishi kerak (9–15 ta raqam)',
  })
  phone: string;

  @ApiProperty({
    example: '8f0e1c3a-9c2b-4d8f-bac0-15e29a6c6f2b',
    description: 'BarberID (UUID)',
  })
  @IsNotEmpty({ message: 'BarberID kiritilishi kerak' })
  @IsUUID('4', { message: 'BarberID noto‘g‘ri formatda' })
  barberId: string;

  @ApiProperty({
    example: '8f0e1c3a-9c2b-4d8f-bac0-15e29a6c6f2b',
    description: 'Barber xizmati ID (UUID)',
  })
  @IsNotEmpty({ message: 'Barber xizmati ID kiritilishi kerak' })
  @IsUUID('4', { message: 'Barber xizmati ID noto‘g‘ri formatda' })
  barberServiceId: string;

  @ApiProperty({
    example: '2025-09-28',
    description: 'Tayinlangan sana (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Tayinlangan sana bo‘sh bo‘lishi mumkin emas' })
  @IsDateString({}, { message: 'Sana noto‘g‘ri formatda (YYYY-MM-DD)' })
  appointmentDate: string;

  @ApiProperty({
    example: '14:30',
    description: 'Tayinlangan vaqt (HH:mm formatida)',
  })
  @IsNotEmpty({ message: 'Tayinlangan vaqt kiritilishi kerak' })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Vaqt noto‘g‘ri formatda (HH:mm)',
  })
  appointmentTime: string;

  @ApiProperty({
    example: 'Soqol olish xizmati uchun',
    description: 'Qo‘shimcha izoh',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Izoh faqat matn bo‘lishi kerak' })
  description?: string;
}

export class UpdateClientDto {
  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Mijozning to‘liq ismi',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
  fullName?: string;

  @ApiProperty({
    example: '998901234567',
    description: 'Foydalanuvchi telefon raqami (faqat raqamlar)',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi kerak' })
  @IsString({ message: 'Telefon raqami matn (string) bo‘lishi kerak' })
  @Matches(/^[0-9]{9,15}$/, {
    message:
      'Telefon raqami faqat raqamlardan iborat bo‘lishi kerak (9–15 ta raqam)',
  })
  @IsOptional()
  phone?: string;
  
  @ApiProperty({
    example: '8f0e1c3a-9c2b-4d8f-bac0-15e29a6c6f2b',
    description: 'BarberID (UUID)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'BarberID noto‘g‘ri formatda' })
  barberId?: string;

  @ApiProperty({
    example: '8f0e1c3a-9c2b-4d8f-bac0-15e29a6c6f2b',
    description: 'Barber xizmati ID (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Barber xizmati ID noto‘g‘ri formatda' })
  barberService?: string;

  @ApiProperty({
    example: '2025-09-28',
    description: 'Tayinlangan sana (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Sana noto‘g‘ri formatda (YYYY-MM-DD)' })
  appointmentDate?: string;

  @ApiProperty({
    example: '14:30',
    description: 'Tayinlangan vaqt (HH:mm formatida)',
    required: false,
  })
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Vaqt noto‘g‘ri formatda (HH:mm)',
  })
  appointmentTime?: string;

  @ApiProperty({
    example: 'Soqol olish xizmati uchun',
    description: 'Qo‘shimcha izoh',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Izoh faqat matn bo‘lishi kerak' })
  decription?: string;
}
