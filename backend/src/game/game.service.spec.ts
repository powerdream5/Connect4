import { Test, TestingModule } from '@nestjs/testing';
import GameService from './game.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('@nestjs/cache-manager', () => ({
  CACHE_MANAGER: Symbol('CACHE_MANAGER'),
}));

const redisMock = {};

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, { provide: CACHE_MANAGER, useValue: redisMock }],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  it('Find Winner', () => {
    const posStat = {};
    gameService.calculate(37, 1, posStat);
    gameService.calculate(36, 2, posStat);
    gameService.calculate(38, 1, posStat);
    gameService.calculate(39, 2, posStat);
    gameService.calculate(40, 1, posStat);
    gameService.calculate(30, 2, posStat);
    gameService.calculate(41, 1, posStat);
    gameService.calculate(31, 2, posStat);
    gameService.calculate(42, 1, posStat);
    gameService.calculate(34, 2, posStat);
    gameService.calculate(29, 1, posStat);
    gameService.calculate(35, 2, posStat);
    gameService.calculate(32, 1, posStat);
    gameService.calculate(22, 2, posStat);
    gameService.calculate(24, 1, posStat);
    gameService.calculate(23, 2, posStat);
    gameService.calculate(27, 1, posStat);
    gameService.calculate(25, 2, posStat);
    gameService.calculate(28, 1, posStat);
    gameService.calculate(16, 2, posStat);
    gameService.calculate(18, 1, posStat);
    gameService.calculate(17, 2, posStat);
    gameService.calculate(9, 1, posStat);
    gameService.calculate(20, 2, posStat);
    gameService.calculate(10, 1, posStat);
    gameService.calculate(21, 2, posStat);
  });
});
