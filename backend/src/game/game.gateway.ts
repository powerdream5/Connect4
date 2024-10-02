import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import GameService from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',  // Enable CORS to allow connections from any origin
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`${client.id} join the room ${room}`);
    client.join(room);
    client.emit('joined_room', room);
  }

  @SubscribeMessage('message_to_room')
  handleMessageToRoom(
    @MessageBody() data: { room: string, message: string },
  ) {
    const { room, message } = data;
    
    const steps = JSON.parse(message);
    const output = { steps, winner: this.gameService.findWinner(steps)}
    this.server.to(room).emit('message_from_room', JSON.stringify(output));
  }
}
