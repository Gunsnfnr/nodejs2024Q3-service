import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { userWithoutPassword } from './utils/user-wo-password';
import { prisma } from 'prisma/prisma-client';

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

    await prisma.users.create({ data: newUser });

    return userWithoutPassword(newUser);
  }

  async findAll() {
    return await prisma.users.findMany();
  }

  async findOne(id: string) {
    const requestedUser: User = await prisma.users.findUnique({
      where: { id: id },
    });
    if (!requestedUser) throw new NotFoundException('User does not exist.');
    return requestedUser;
  }

  async update(id: string, UpdatePasswordDto: UpdatePasswordDto) {
    const processedUser: User = await this.findOne(id);
    if (!processedUser) throw new NotFoundException('User does not exist.');
    if (processedUser.password !== UpdatePasswordDto.oldPassword)
      throw new ForbiddenException('Old password is wrong.');
    processedUser.updatedAt = Date.now();
    processedUser.version += 1;
    processedUser.password = UpdatePasswordDto.newPassword;
    await prisma.users.update({ where: { id: id }, data: processedUser });

    return userWithoutPassword(processedUser);
  }

  async remove(id: string) {
    const processedUser: User = await this.findOne(id);
    if (!processedUser) throw new NotFoundException('User does not exist.');
    await prisma.users.delete({ where: { id: id } });
  }
}
