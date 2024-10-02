import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GameGateway } from './game.gateway';
import GameService from './game.service';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import GameController from './game.controller';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
        store: redisStore,
        socket: {
            host: 'localhost',
            port: 6379
        }
    }),
  ],
  controllers: [GameController],
  providers: [GameGateway, GameService],
})
export default class GameModule {}