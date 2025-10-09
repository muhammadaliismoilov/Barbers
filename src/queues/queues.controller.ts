import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueuesService } from './queues.service';
import { ClientQueueDto } from './dto/queues.dto';


@ApiTags('Queues')
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}


@Get(':barberId')
@ApiOperation({ summary: 'Barber navbatini olish' })
@ApiParam({
  name: 'barberId',
  example: '7b0d9e0f-7b65-4c29-8e5f-4f502b7cb4e3',
  description: 'Barberning ID raqami',
})
@ApiResponse({
  status: 200,
  description: 'Berilgan barberga tegishli mijozlar ro‘yxati qaytarildi',
  type: [ClientQueueDto],
})
@ApiResponse({ status: 404, description: 'Barber topilmadi' })
async getBarberQueues(
  @Param('barberId') barberId: string,
): Promise<ClientQueueDto[]> {
  return this.queuesService.queues(barberId);
}

}
