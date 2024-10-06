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
    gameService.calculate(38, 1, posStat);
    gameService.calculate(39, 2, posStat);
    gameService.calculate(31, 1, posStat);
    gameService.calculate(32, 2, posStat);
  });
});
