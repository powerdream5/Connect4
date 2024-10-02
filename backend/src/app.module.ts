import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import GameModule from './game/game.module';
import corsMiddleware from './middleware/cors.middleware';

@Module({
  imports: [GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(corsMiddleware).forRoutes('*');
  }
}
