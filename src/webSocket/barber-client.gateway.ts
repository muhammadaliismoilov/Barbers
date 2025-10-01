// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { ClientsService } from 'src/clients/clients.service';

// @WebSocketGateway({ cors: true })
// export class BarberClientGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private readonly clientsService: ClientsService) {}

//   // ✅ Mijoz qo‘shilganda
//   async clientAdded(clientData: any) {
//     this.server.emit('client_added', clientData);
//   }

//   // ✅ Status o‘zgarishi (pending → in_progress → completed)
//   async statusChanged(clientId: string, status: string) {
//     this.server.emit('status_changed', { clientId, status });
//   }

// //   ❗ Test uchun oddiy handler
//   @SubscribeMessage('ping')
//   handlePing(@MessageBody() data: string) {
//     return { event: 'pong', data };
//   }
// }

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
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
