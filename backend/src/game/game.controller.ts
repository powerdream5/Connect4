import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import GameService from './game.service';
import CreateGameDto from './dto/create-game.dto';
import JoinGameDto from './dto/join-game.dto';
import ExitGameDto from './dto/exit-game.dto';
import { GameGateway } from './game.gateway';
import { GAME_SYNC_TYPE_EXIT, GAME_SYNC_TYPE_JOIN } from 'src/utils/constant';

@Controller('game')
export default class AppController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
  ) {}

  @Post()
  async createGame(@Body() dto: CreateGameDto) {
    try {
      const game = await this.gameService.createGame(dto);

      if (game) {
        this.gameGateway.server.emit(
          'message_from_server',
          JSON.stringify({ msgType: 'new_game', game }),
        );
      }

      return {
        success: 1,
        data: game,
      };
    } catch (error) {
      throw new HttpException(
        'Game is not created successfully! Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async listGame() {
    try {
      const games = await this.gameService.listGame();

      return {
        success: 1,
        data: games,
      };
    } catch (error) {
      throw new HttpException(
        'Cannot fetch games! Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':gameId')
  async joinGame(@Param('gameId') gameId: string, @Body() dto: JoinGameDto) {
    try {
      const game = await this.gameService.joinGame(gameId, dto);
      if (game) {
        this.gameGateway.server.to(game.gameId).emit(
          'message_from_room',
          JSON.stringify({
            syncType: GAME_SYNC_TYPE_JOIN,
            game,
            playerIndex: dto.playerIndex,
          }),
        );

        this.gameGateway.server.emit(
          'message_from_server',
          JSON.stringify({ msgType: 'join_game', game }),
        );

        return {
          success: 1,
          data: game,
        };
      } else {
        return {
          success: 0,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Game is not created successfully! Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':gameId/exit')
  async exitGame(@Param('gameId') gameId: string, @Body() dto: ExitGameDto) {
    try {
      const game = await this.gameService.exitGame(gameId, dto.userId);
      if (game) {
        this.gameGateway.server.to(game.gameId).emit(
          'message_from_room',
          JSON.stringify({
            syncType: GAME_SYNC_TYPE_EXIT,
            game,
            playerIndex: !game.player1_id ? 1 : 2,
          }),
        );

        this.gameGateway.server.emit(
          'message_from_server',
          JSON.stringify({ msgType: 'exit_game', game }),
        );
        return {
          success: 1,
          data: game,
        };
      } else {
        return {
          success: 0,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Game is not created successfully! Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
