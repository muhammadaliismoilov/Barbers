import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty({ example: 25000, description: 'Kunlik daromad' })
  dailyIncome: number;

  @ApiProperty({ example: 5, description: 'Jami mijozlar soni' })
  totalClients: number;

  @ApiProperty({ example: 4, description: 'Tugallangan mijozlar soni' })
  completedClients: number;

  @ApiProperty({ example: 25000, description: 'O‘rtacha narx' })
  averagePrice: number;

  @ApiProperty({
    example: [{ service: 'Soch olish', count: 3, income: 75000 }],
    description: 'Xizmatlar bo‘yicha statistikalar',
  })
  servicesBy: { service: string; count: number; income: number }[];

  @ApiProperty({
    example: [{ hour: '10:00', clients: 2, income: 50000 }],
    description: 'Soatlar bo‘yicha statistikalar',
  })
  hoursBy: { hour: string; clients: number; income: number }[];
}
