import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  // UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
// import { AuthGuard } from './auth.guard';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // @UseGuards(AuthGuard)
  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @HttpCode(200)
  create(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }
}
