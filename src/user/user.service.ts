import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { userWithoutPassword } from './utils/user-wo-password';
import { prisma } from 'src/prisma-client';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const creationTimestamp = Date.now();

    const newUser: User = {
      id: crypto.randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
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

    return userWithoutPassword(newUser);
  }

  async findAll() {
    const users: User[] = (await prisma.users.findMany()).map((user) => {
      return {
        id: user.id,
        login: user.login,
        password: user.password,
        version: user.version,
        createdAt: Number(user.createdAt),
        updatedAt: Number(user.updatedAt),
      };
    });

    return users;
  }

  async findOne(id: string) {
    const requestedUser = await prisma.users.findUnique({
      where: { id: id },
    });
    if (!requestedUser) throw new NotFoundException('User does not exist.');
    return {
      id: requestedUser.id,
      login: requestedUser.login,
      password: requestedUser.password,
      version: requestedUser.version,
      createdAt: Number(requestedUser.createdAt),
      updatedAt: Number(requestedUser.updatedAt),
    };
  }

  async update(id: string, UpdatePasswordDto: UpdatePasswordDto) {
    const processedUser: User = await this.findOne(id);
    if (!processedUser) throw new NotFoundException('User does not exist.');
    if (processedUser.password !== UpdatePasswordDto.oldPassword)
      throw new ForbiddenException('Old password is wrong.');
    processedUser.updatedAt = Date.now();
    processedUser.version += 1;
    processedUser.password = UpdatePasswordDto.newPassword;

    await prisma.users.update({
      where: { id: id },
      data: {
        id: processedUser.id,
        login: processedUser.login,
        password: processedUser.password,
        version: processedUser.version,
        createdAt: String(processedUser.createdAt),
        updatedAt: String(processedUser.updatedAt),
      },
    });

    return userWithoutPassword(processedUser);
  }

  async remove(id: string) {
    const processedUser: User = await this.findOne(id);
    if (!processedUser) throw new NotFoundException('User does not exist.');
    await prisma.users.delete({ where: { id: id } });
  }
}
