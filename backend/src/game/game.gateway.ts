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
import {
  GAME_SYNC_TYPE_IN_FLY,
  GAME_SYNC_TYPE_START,
} from 'src/utils/constant';

@WebSocketGateway({
  cors: {
    origin: '*', // Enable CORS to allow connections from any origin
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
  async handleMessageToRoom(
    @MessageBody()
    data: {
      room: string;
      syncType: string;
      playerIndex: number;
      game: string;
    },
  ) {
    const { room, syncType, playerIndex, game } = data;

    switch (syncType) {
      case GAME_SYNC_TYPE_IN_FLY: {
        const updatedGame = await this.gameService.updateGameData(
          JSON.parse(game),
        );
        delete updatedGame.posStats;

        this.server
          .to(room)
          .emit(
            'message_from_room',
            JSON.stringify({ syncType, playerIndex, game: updatedGame }),
          );
        break;
      }
      case GAME_SYNC_TYPE_START: {
        const newGame = await this.gameService.restartGame(
          JSON.parse(game),
          playerIndex,
        );
        this.server
          .to(room)
          .emit(
            'message_from_room',
            JSON.stringify({ syncType, playerIndex, game: newGame }),
          );
        break;
      }
    }
  }
}
