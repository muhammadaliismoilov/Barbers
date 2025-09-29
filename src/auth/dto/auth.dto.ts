import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/users/user.entity';

export class RegisterDto {
  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchining to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (unikal)',
  })
  @IsPhoneNumber('UZ')
  @IsString({})
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: 'Parol (kamida 6 belgidan iborat bo‘lishi kerak)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}


export class LoginDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  @IsPhoneNumber('UZ', { message: 'Telefon raqami noto‘g‘ri formatda' })
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Parol' })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;

  @ApiProperty({
    example: Role.USER,
    enum: Role,
    required: false,
    description: 'Role (admin, user, barber) tanlash ixtiyoriy',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role faqat admin | user | barber bo‘lishi mumkin' })
  role?: Role;
}

