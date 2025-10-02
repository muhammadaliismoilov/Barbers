import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueuesService } from './queues.service';
import { ClientQueueDto } from './dto/queues.dto';


@ApiTags('Queues')
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Get(':barberId')
  @ApiOperation({ summary: 'Barber navbati', description: 'Berilgan barberga tegishli mijozlar navbatini qaytaradi' })
  @ApiParam({ name: 'barberId', example: 'uuid-barber-123', description: 'Barber IDsi' })
  @ApiResponse({
    status: 200,
    description: 'Berilgan barberning navbatdagi mijozlari',
    type: [ClientQueueDto],
  })
  async getBarberQueues(@Param('barberId') barberId: string): Promise<ClientQueueDto[]> {
    return this.queuesService.queues(barberId);
  }
}
