import { User } from '../entities/user.entity';

const userWithoutPassword = (user: User) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'password'),
  );
};
export { userWithoutPassword };
