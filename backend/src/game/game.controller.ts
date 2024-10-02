import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import GameService from './game.service';
import CreateGameDto from './dto/create-game.dto';

@Controller('game')
export default class AppController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Body() dto: CreateGameDto) {
    try {
        
        const game = await this.gameService.createGame(dto);

        return {
            success: 1,
            data: game
        }
    }
    catch(error) {
        throw new HttpException(
            'Game is not created successfully! Please try again', 
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @Get()
  async listGame() {
    try {
        
        const games = await this.gameService.listGame();

        return {
            success: 1,
            data: games
        }
    }
    catch(error) {
        throw new HttpException(
            'Cannot fetch games! Please try again', 
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
