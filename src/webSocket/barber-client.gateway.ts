
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class BarberClientGateway {
  @WebSocketServer()
  server: Server;

  // Mijoz qo‘shilganda frontendga yuborish
  clientAdded(clientData: any) {
    this.server.emit('client_added', clientData);
  }

  // Status o‘zgarganda frontendga yuborish
  statusChanged(clientId: string, status: string) {
    this.server.emit('status_changed', { clientId, status });
  }
}
