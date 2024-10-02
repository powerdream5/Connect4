import { Test, TestingModule } from '@nestjs/testing';
import GameService from './game.service';
import exp from 'constants';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  it('Horizont Winner', () => {
    const steps = {"2":1,"9":2,"10":1,"15":1,"17":2,"18":2,"19":2,"20":2,"24":1,"26":1};
    const winner = gameService.findWinner(steps);

    expect(winner).toBe(2);
  });

  it('Vertical Winner', () => {
    const steps = {"3":1,"4":2,"10":1,"11":2,"17":1,"18":2,"24":1};
    const winner = gameService.findWinner(steps);

    expect(winner).toBe(1);
  });

  it('Bottom Right Winner', () => {
    const steps = {"2":1,"3":2,"4":1,"11":2,"17":1,"18":1,"19":2,"27":2};
    const winner = gameService.findWinner(steps);

    expect(winner).toBe(2);
  });

  it('Bottom Left Winner', () => {
    const steps = {"4":1,"10":1,"11":2,"12":1,"16":2,"17":2,"18":1,"19":2,"23":2,"24":1,"30":1};
    const winner = gameService.findWinner(steps);

    expect(winner).toBe(1);
  });
});
