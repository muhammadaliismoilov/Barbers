import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

// 🧩 CREATE DTO
export class CreateUsersInfoDto {
  @ApiProperty({
    example: 'b6c7e8d2-31a1-4e91-9c41-5aaf5f6b1203',
    description: 'Foydalanuvchining (user) ID raqami — bu user jadvalidan olinadi',
  })
  @IsUUID('4', { message: 'userId UUID formatida bo‘lishi kerak' })
  userId: string;

  @ApiProperty({
    example: 'Men 5 yildan beri soch oldirish xizmatida ishlayman',
    description: 'Barber haqida qisqacha tavsif (ixtiyoriy maydon)',
  })
  @IsOptional()
  @IsString({ message: 'description faqat string matn bo‘lishi kerak' })
  description?: string;

  @ApiProperty({
    example: 5,
    description: 'Tajriba yillari soni (default: 0)',
  })
  @IsInt({ message: 'experienceYears faqat butun son bo‘lishi kerak' })
  @Min(0, { message: 'experienceYears manfiy bo‘lmasligi kerak' })
  experienceYears: number;

  @ApiProperty({
    example: '09:00 - 20:00',
    description: 'Ish vaqti (masalan: "09:00 - 20:00")',
  })
  @IsOptional()
  @IsString({ message: 'workHours faqat string matn bo‘lishi kerak' })
  @MaxLength(100, { message: 'workHours 100 belgidan oshmasligi kerak' })
  workHours?: string;

  @ApiProperty({
    example: true,
    description: 'Barber faol yoki yo‘qligi (true — faol, false — faol emas)',
  })
  @IsBoolean({ message: 'isActive qiymati true yoki false bo‘lishi kerak' })
  isActive: boolean;
}



// 🧩 UPDATE DTO
export class UpdateUsersInfoDto {
 @ApiProperty({
    example: 'b6c7e8d2-31a1-4e91-9c41-5aaf5f6b1203',
    description: 'Foydalanuvchining (user) ID raqami — bu user jadvalidan olinadi',
  })
  @IsUUID('4', { message: 'userId UUID formatida bo‘lishi kerak' })
    @IsOptional()
  userId?: string;

  @ApiProperty({
    example: 'Yangi xizmatlar qo‘shildi va ish vaqti kengaytirildi',
    description: 'Yangilangan tavsif (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description faqat string matn bo‘lishi kerak' })
  description?: string;

  @ApiProperty({
    example: 7,
    description: 'Yangilangan tajriba yillari soni (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'experienceYears faqat butun son bo‘lishi kerak' })
  @Min(0, { message: 'experienceYears manfiy bo‘lmasligi kerak' })
  experienceYears?: number;

  @ApiProperty({
    example: '08:00 - 22:00',
    description: 'Yangilangan ish vaqti (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'workHours faqat string matn bo‘lishi kerak' })
  @MaxLength(100, { message: 'workHours 100 belgidan oshmasligi kerak' })
  workHours?: string;

  @ApiProperty({
    example: false,
    description: 'Barber faol yoki yo‘qligini yangilash (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive qiymati true yoki false bo‘lishi kerak' })
  isActive?: boolean;
}
