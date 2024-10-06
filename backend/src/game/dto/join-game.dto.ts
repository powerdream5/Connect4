// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export default class JoinGameDto {
  @IsString()
  @IsNotEmpty({ message: 'user id is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'username is required' })
  userName: string;
}
