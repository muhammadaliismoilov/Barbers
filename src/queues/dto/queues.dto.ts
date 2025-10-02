import { ApiProperty } from '@nestjs/swagger';
import { ClientStatus } from 'src/clients/client.entity';


export class ClientQueueDto {
  @ApiProperty({ example: 'uuid-1', description: 'Mijozning IDsi' })
  id: string;

  @ApiProperty({ example: 'Ali Valiyev', description: 'Mijoz ismi' })
  name: string;

  @ApiProperty({ example: '+998901112233', description: 'Telefon raqami' })
  phone: string;

  @ApiProperty({ example: '2025-10-01', description: 'Uchrashuv sanasi' })
  date: string;

  @ApiProperty({ example: '09:00:00', description: 'Uchrashuv vaqti' })
  time: string;

  @ApiProperty({ example: 'pending', enum: ClientStatus, description: 'Mijoz statusi' })
  status: ClientStatus;

  @ApiProperty({ example: 'Soch olish', description: 'Xizmat nomi' })
  serviceTitle: string;
}
