import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
