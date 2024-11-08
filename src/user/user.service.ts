import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { users } from './data';
import { User } from './entities/user.entity';
import { userWithoutPassword } from './utils/user-wo-password';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const creationTimestamp = Date.now();

    const newUser: User = {
      id: crypto.randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: creationTimestamp,
      updatedAt: creationTimestamp,
    };

    users.push(newUser);

    return userWithoutPassword(newUser);
  }

  findAll() {
    return users;
  }

  findOne(id: string) {
    const requestedUser: User = users.filter((user: User) => user.id === id)[0];
    return requestedUser;
  }

  update(id: string, UpdatePasswordDto: UpdatePasswordDto) {
    const processedUser: User = users.filter((user: User) => user.id === id)[0];
    if (processedUser.password !== UpdatePasswordDto.oldPassword)
      throw new ForbiddenException('Old password is wrong.');
    processedUser.updatedAt = Date.now();
    processedUser.version += 1;
    processedUser.password = UpdatePasswordDto.newPassword;

    return userWithoutPassword(processedUser);
  }

  remove(id: string) {
    let indexOfUser: number | undefined;
    users.forEach((user, index) => {
      if (user.id === id) {
        indexOfUser = index;
      }
    });
    users.splice(indexOfUser, 1);
  }
}
