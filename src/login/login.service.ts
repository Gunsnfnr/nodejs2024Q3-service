import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { prisma } from 'src/prisma-client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateLoginDto } from './dto/update-login.dto';

type AuthPayload = {
  id: string;
  username: string;
};

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
    const payload: AuthPayload = { id: user.id, username: user.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return {
      accessToken,
      refreshToken,
      id: user.id,
    };
  }

  decodeRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async refresh(updateLoginDto: UpdateLoginDto) {
    if (!('refreshToken' in updateLoginDto)) {
      throw new UnauthorizedException('No refresh token in request.');
    }
    const payload: AuthPayload = this.decodeRefreshToken(
      updateLoginDto.refreshToken,
    );
    const accessToken = await this.jwtService.signAsync({
      userId: payload.id,
      login: payload.username,
    });
    const refreshToken = await this.jwtService.signAsync(
      { userId: payload.id, login: payload.username },
      {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
