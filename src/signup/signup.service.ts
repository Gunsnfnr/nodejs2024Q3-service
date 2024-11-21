import { Injectable } from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { prisma } from 'src/prisma-client';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SignupService {
  async create(createSignupDto: CreateSignupDto) {
    const creationTimestamp = Date.now();
    const newUser: User = {
      id: crypto.randomUUID(),
      login: createSignupDto.login,
      password: createSignupDto.password,
      version: 1,
      createdAt: creationTimestamp,
      updatedAt: creationTimestamp,
    };

    await prisma.users.create({
      data: {
        id: newUser.id,
        login: newUser.login,
        password: newUser.password,
        version: newUser.version,
        createdAt: String(creationTimestamp),
        updatedAt: String(creationTimestamp),
      },
    });

    return 'User created.';
  }
}
