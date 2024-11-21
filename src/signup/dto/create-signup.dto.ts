import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSignupDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
