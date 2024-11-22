import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { prisma } from 'src/prisma-client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(private jwtService: JwtService) {}

  private async findOne(login: string) {
    const user = await prisma.users.findFirst({
      where: { login },
    });
    if (!user)
      throw new ForbiddenException(
        'Authentication failed: wrong login provided.',
      );
    return user;
  }

  async create(createLoginDto: CreateLoginDto) {
    const user = await this.findOne(createLoginDto.login);
    const isPasswordCorrect = await bcrypt.compare(
      createLoginDto.password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new ForbiddenException('Authentication failed: wrong password.');
    const payload = { sub: user.id, username: user.login };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      id: user.id,
    };
  }
}
