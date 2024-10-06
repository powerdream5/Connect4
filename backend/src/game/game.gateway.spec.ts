import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import GameService from './game.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('@nestjs/cache-manager', () => ({
  CACHE_MANAGER: Symbol('CACHE_MANAGER'),
}));

const redisMock = {};

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        GameService,
        { provide: CACHE_MANAGER, useValue: redisMock },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
