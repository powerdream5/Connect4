import { Inject, Injectable } from '@nestjs/common';
import CreateGameDto from './dto/create-game.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './types';
import JoinGameDto from './dto/join-game.dto';
import {
  GAME_STATUS_PENDING,
  GAME_STATUS_IN_FLY,
  GAME_STATUS_CLOSED,
} from './../utils/constant';

const GAME_BOARD_WIDTH = 7;
const GAME_BOARD_HEIGHT = 6;
const CONNECT_THRESHOLD = 4;

@Injectable()
export default class GameService {
  constructor(@Inject(CACHE_MANAGER) private redis: Cache<RedisStore>) {}

  calculate(
    pos: number,
    player: number,
    posStat: Record<number, Record<string, number | Record<string, number>>>,
  ): number {
    const currStat = { player, stat: {} };

    const directions = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
    directions.map((d) => {
      let len = 0;
      let neighbor = pos;
      switch (d) {
        case 't':
          do {
            len += 1;
            neighbor -= GAME_BOARD_WIDTH;
          } while (neighbor > 0 && posStat[neighbor]?.player === player);
          break;
        case 'tr':
          do {
            len += 1;
            neighbor -= GAME_BOARD_WIDTH - 1;
          } while (
            (neighbor - 1) % GAME_BOARD_WIDTH != 0 &&
            neighbor > 0 &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'r':
          do {
            len += 1;
            neighbor += 1;
          } while (
            (neighbor - 1) % GAME_BOARD_WIDTH != 0 &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'br':
          do {
            len += 1;
            neighbor += GAME_BOARD_WIDTH + 1;
          } while (
            (neighbor - 1) % GAME_BOARD_WIDTH != 0 &&
            neighbor <= GAME_BOARD_WIDTH * GAME_BOARD_HEIGHT &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'b':
          do {
            len += 1;
            neighbor += GAME_BOARD_WIDTH;
          } while (
            neighbor <= GAME_BOARD_WIDTH * GAME_BOARD_HEIGHT &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'bl':
          do {
            len += 1;
            neighbor += GAME_BOARD_WIDTH - 1;
          } while (
            (neighbor + 1) % GAME_BOARD_WIDTH != 1 &&
            neighbor <= GAME_BOARD_WIDTH * GAME_BOARD_HEIGHT &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'l':
          do {
            len += 1;
            neighbor -= 1;
          } while (
            (neighbor + 1) % GAME_BOARD_WIDTH != 1 &&
            posStat[neighbor]?.player === player
          );
          break;
        case 'tl':
          do {
            len += 1;
            neighbor -= GAME_BOARD_WIDTH + 1;
          } while (
            (neighbor + 1) % GAME_BOARD_WIDTH != 1 &&
            neighbor > 0 &&
            posStat[neighbor]?.player === player
          );
          break;
      }

      currStat.stat[d] = len;
    });

    posStat[pos] = currStat;

    console.log(currStat);

    for (let i = 0; i < directions.length; i += 1) {
      const d = directions[i];
      if (currStat.stat[d] >= CONNECT_THRESHOLD) {
        return currStat.player;
      }

      const connectedNums = currStat.stat[d] - 1;
      if (connectedNums === 0) {
        continue;
      }

      let neighbor;
      switch (d) {
        case 't':
          neighbor = pos - connectedNums * GAME_BOARD_WIDTH;
          posStat[neighbor].stat['b'] += currStat.stat['b'];
          if (posStat[neighbor].stat['b'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'tr':
          neighbor = pos - connectedNums * (GAME_BOARD_WIDTH - 1);
          posStat[neighbor].stat['bl'] += currStat.stat['bl'];
          if (posStat[neighbor].stat['bl'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'r':
          neighbor = pos + connectedNums;
          posStat[neighbor].stat['l'] += currStat.stat['l'];
          if (posStat[neighbor].stat['l'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'br':
          neighbor = pos + connectedNums * (GAME_BOARD_WIDTH + 1);
          posStat[neighbor].stat['tl'] += currStat.stat['tl'];
          if (posStat[neighbor].stat['tl'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'b':
          neighbor = pos + connectedNums * GAME_BOARD_WIDTH;
          posStat[neighbor].stat['t'] += currStat.stat['t'];
          if (posStat[neighbor].stat['t'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'bl':
          neighbor = pos + connectedNums * (GAME_BOARD_WIDTH - 1);
          posStat[neighbor].stat['tr'] += currStat.stat['tr'];
          if (posStat[neighbor].stat['tr'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'l':
          neighbor = pos - connectedNums;
          posStat[neighbor].stat['r'] += currStat.stat['r'];
          if (posStat[neighbor].stat['r'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
        case 'tl':
          neighbor = pos - connectedNums * (GAME_BOARD_WIDTH + 1);
          posStat[neighbor].stat['br'] += currStat.stat['br'];
          if (posStat[neighbor].stat['br'] >= CONNECT_THRESHOLD) {
            return currStat.player;
          }
          break;
      }
    }

    return 0;
  }

  async fetchGame(gameId: string) {
    return JSON.parse(await this.redis.get(`games:${gameId}`));
  }

  async saveGame(game: Game) {
    await this.redis.set(
      `games:${game.gameId}`,
      JSON.stringify(game),
      3600 * 24 * 1000,
    );
  }

  async updateGameData(game: Game): Promise<Game> {
    const redisGame = {
      ...(await this.fetchGame(game.gameId)),
      ...game,
    };
    const posStat = redisGame.posStat ?? {};
    const winner = game.lastStep
      ? this.calculate(game.lastStep.pos, game.lastStep.player, posStat)
      : 0;

    if (winner) {
      redisGame.player1_ready = false;
      redisGame.player2_ready = false;
    }

    if (winner === 1) {
      redisGame.player1_wins = (game.player1_wins ?? 0) + 1;
    } else if (winner === 2) {
      redisGame.player2_wins = (game.player2_wins ?? 0) + 1;
    }

    const updatedGame = {
      ...redisGame,
      winner,
      posStat,
    };

    await this.saveGame(updatedGame);

    return updatedGame;
  }

  async createGame(dto: CreateGameDto): Promise<Game> {
    const gameId = uuidv4();
    const game = {
      gameId,
      player1_id: dto.userId,
      player1_name: dto.userName,
      player1_ready: true,
      status: GAME_STATUS_PENDING,
    };

    await this.redis.set(
      `games:${gameId}`,
      JSON.stringify(game),
      3600 * 24 * 1000,
    );

    return game;
  }

  async listGame(): Promise<Game[]> {
    const gameKeys = await this.redis.store.keys('games:*');

    const games = await Promise.all(
      gameKeys.map(async (key) => JSON.parse(await this.redis.get(key))),
    );

    return games.filter((game) => game.status !== GAME_STATUS_CLOSED);
  }

  async joinGame(gameId: string, dto: JoinGameDto): Promise<Game> {
    try {
      const game = JSON.parse(await this.redis.get(`games:${gameId}`));
      if (game) {
        if (dto.playerIndex == 2) {
          if (!game.player2_id) {
            game.player2_id = dto.userId;
            game.player2_name = dto.userName;
            game.player2_ready = true;
          } else {
            return null;
          }
        } else if (dto.playerIndex == 1) {
          if (!game.player1_id) {
            game.player1_id = dto.userId;
            game.player1_name = dto.userName;
            game.player1_ready = true;
          } else {
            return null;
          }
        }

        game.status = GAME_STATUS_IN_FLY;
        await this.redis.set(
          `games:${gameId}`,
          JSON.stringify(game),
          3600 * 24 * 1000,
        );

        return game;
      }

      return null;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async restartGame(gameId: string, playerIndex: number): Promise<Game> {
    const game = await this.fetchGame(gameId);

    if (playerIndex == 1) {
      game.player1_ready = true;
    } else if (playerIndex == 2) {
      game.player2_ready = true;
    }

    if (game.player1_ready && game.player2_ready) {
      delete game.winner;
      delete game.lastStep;
      delete game.posStat;
      delete game.steps;
    }

    await this.saveGame(game);

    return game;
  }

  async exitGame(gameId: string, userId: string): Promise<Game> {
    const game = await this.fetchGame(gameId);

    delete game.winner;
    delete game.lastStep;
    delete game.posStat;
    delete game.steps;
    delete game.player1_wins;
    delete game.player2_wins;

    if (userId === game.player1_id) {
      game.player1_id = null;
      game.player1_name = null;
      game.player1_ready = false;
      game.player2_ready = true;
    } else if (userId === game.player2_id) {
      game.player2_id = null;
      game.player2_name = null;
      game.player2_ready = false;
      game.player1_ready = true;
    }

    if (game.player1_id || game.player2_id) {
      game.status = GAME_STATUS_PENDING;
    } else {
      game.status = GAME_STATUS_CLOSED;
    }

    await this.saveGame(game);

    return game;
  }
}
