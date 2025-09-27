import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
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
  fullname: string;

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
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami',
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: 'Foydalanuvchining paroli',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
