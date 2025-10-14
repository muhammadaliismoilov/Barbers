import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ClientStatus } from 'src/clients/client.entity';

export class ClientQueueDto {
  @ApiProperty({ example: 'uuid-1', description: 'Mijozning IDsi' })
  id: string;

  @ApiProperty({ example: 'Ali Valiyev', description: 'Mijoz ismi' })
  name: string;

  @ApiProperty({ example: '+998901112233', description: 'Telefon raqami' })
  phone: string;

  @ApiProperty({
    example: '2025-10-01',
    description: 'Uchrashuv sanasi (YYYY-MM-DD formatda)',
  })
  @Transform(({ value }) =>
    value ? new Date(value).toISOString().split('T')[0] : null,
  )
  date: string;

  @ApiProperty({
    example: '09:00:00',
    description: 'Uchrashuv vaqti (HH:mm:ss formatda)',
  })
  @Transform(({ value }) => {
    if (!value) return null;
    if (typeof value === 'string') return value.split('.')[0]; // '14:30:00.000Z' => '14:30:00'
    if (value instanceof Date)
      return value.toTimeString().split(' ')[0]; // Date bo‘lsa
    return value;
  })
  time: string;

  @ApiProperty({
    example: 'pending',
    enum: ClientStatus,
    description: 'Mijoz statusi',
  })
  status: ClientStatus;

  @ApiProperty({ example: 'Soch olish', description: 'Xizmat nomi' })
  serviceTitle: string;
}
