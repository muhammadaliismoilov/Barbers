import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../user.entity';

export class UpdateUserDto  {
  @ApiPropertyOptional({ example: 'Ali Valiyev', description: 'Foydalanuvchi to‘liq ismi' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Telefon raqami (unikal)' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'newPassword123', description: 'Parol' })
  @IsOptional()
  @IsString()
  password?: string;

}
