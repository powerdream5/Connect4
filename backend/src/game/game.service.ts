import { Inject, Injectable } from "@nestjs/common";
import CreateGameDto from "./dto/create-game.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { RedisStore } from "cache-manager-redis-yet";
import { Cache } from "cache-manager";
import { v4 as uuidv4 } from 'uuid';
import { Game } from './types';

@Injectable()
export default class GameService {

    constructor(@Inject(CACHE_MANAGER) private redis: Cache<RedisStore>) {

    }

    checkRight(steps:Record<number, number>, index:number, player:number, count:number) {
        if(count === 4) {
            return player;
        }

        if(index % 7 === 0) {
            return 0;
        }

        const neighbor = `${index + 1}`;
        if(neighbor in steps && steps[neighbor] === player) {
            return this.checkRight(steps, +neighbor, player, count+1);
        }

        return 0;
    }

    checkBottom(steps:Record<number, number>, index:number, player:number, count:number) {
        if(count === 4) {
            return player;
        }

        if(index > 42) {
            return 0;
        }

        const neighbor = `${index + 7}`;
        if(neighbor in steps && steps[neighbor] === player) {
            return this.checkBottom(steps, +neighbor, player, count+1);
        }

        return 0;
    }

    checkBottomRight(steps:Record<number, number>, index:number, player:number, count:number) {
        if(count === 4) {
            return player;
        }

        if(index > 42 || index % 7 === 0) {
            return 0;
        }

        const neighbor = `${index + 8}`;
        if(neighbor in steps && steps[neighbor] === player) {
            return this.checkBottomRight(steps, +neighbor, player, count+1);
        }

        return 0;
    }

    checkBottomLeft(steps:Record<number, number>, index:number, player:number, count:number) {
        if(count === 4) {
            return player;
        }

        if(index > 42 || index % 7 === 1) {
            return 0;
        }

        const neighbor = `${index + 6}`;
        if(neighbor in steps && steps[neighbor] === player) {
            return this.checkBottomLeft(steps, +neighbor, player, count+1);
        }

        return 0;
    }

    findWinner(steps: Record<number, number>): number {
        const indexes = Object.keys(steps);
        if(indexes.length < 7 ) {
            return 0;
        }

        indexes.sort();

        let winner = 0;
        for(let i=0; i<indexes.length; i++) {
            const player = steps[indexes[i]];

            winner = this.checkRight(steps, +indexes[i], player, 1);
            winner = winner || this.checkBottom(steps, +indexes[i], player, 1);
            winner = winner || this.checkBottomRight(steps, +indexes[i], player, 1);
            winner = winner || this.checkBottomLeft(steps, +indexes[i], player, 1);

            if(winner) {
                break;
            }
        }

        return winner;
    }

    async createGame(dto: CreateGameDto):Promise<Game> {
        const gameId = uuidv4();
        const game = {
            gameId,
            player1_id: dto.userId,
            player1_name: dto.userName,
            status: "pending"
        }

        await this.redis.set(`games:${gameId}`, JSON.stringify(game), 3600 * 24 * 1000);

        return game;
    }

    async listGame(): Promise<Game[]> {
        const games = await this.redis.store.keys('games:*');

        console.log(games);

        return [];
    }
}