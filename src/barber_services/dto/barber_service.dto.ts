import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';

// 📝 Create DTO
export class CreateBarberServiceDto {

  @ApiProperty({ example: 'b1a6c4e3-9d49-4d3c-9d23-fb1c1e61e1c4', description: 'Barber ID' })
  @IsNotEmpty({ message: 'Barber ID bo‘sh bo‘lmasligi kerak' })
  @IsUUID()
  barberId: string;

  @ApiProperty({
    example: 'Soch olish',
    description: 'Xizmat nomi',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({message:'Xizmat nomi bosh bolmasligi kerak'})
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 50000,
    description: 'Xizmat narxi (so‘mda)',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Xizmat davomiyligi (minutlarda)',
  })
  @IsNumber()
  @Min(1)
  duration: number; // kamida 1 daqiqa
}

// 📝 Update DTO
export class UpdateBarberServiceDto extends PartialType(CreateBarberServiceDto) {

  @ApiProperty({ example: 'b1a6c4e3-9d49-4d3c-9d23-fb1c1e61e1c4', description: 'Barber ID',required:false })
  @IsOptional()
 @IsUUID()
  barberId?: string;

  @ApiProperty({
    example: 'Soqol olish',
    description: 'Yangilangan xizmat nomi',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string; 

  @ApiProperty({
    example: 70000.0,
    description: 'Yangilangan narx',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    example: 45,
    description: 'Yangilangan davomiylik (minutlarda)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}
