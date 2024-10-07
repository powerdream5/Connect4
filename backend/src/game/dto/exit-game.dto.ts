// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export default class ExitGameDto {
  @IsString()
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;
}
