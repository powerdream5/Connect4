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
import { GameGateway } from './game.gateway';
import { GAME_SYNC_TYPE_JOIN } from 'src/utils/constant';

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
            playerIndex: 2,
          }),
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
