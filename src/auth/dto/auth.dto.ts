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

}

export class ChangePasswordDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  @IsPhoneNumber('UZ', { message: 'Telefon raqami noto‘g‘ri formatda' })
  phone: string;

  @ApiProperty({ example: 'newPassword123', description: 'Yangi parol' })
  @IsString()
  @MinLength(6, { message: 'Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  newPassword: string;
}

