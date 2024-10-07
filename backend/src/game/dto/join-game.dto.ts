// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class JoinGameDto {
  @IsString()
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Player number is required' })
  playerIndex: number;
}
