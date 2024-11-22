import { Injectable } from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { prisma } from 'src/prisma-client';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupService {
  async create(createSignupDto: CreateSignupDto) {
    const creationTimestamp = Date.now();

    const hashedPassword = await bcrypt.hash(
      createSignupDto.password,
      Number(process.env.CRYPT_SALT),
    );

    const newUser: User = {
      id: crypto.randomUUID(),
      login: createSignupDto.login,
      password: hashedPassword,
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

    return {
      id: newUser.id,
    };
  }
}
