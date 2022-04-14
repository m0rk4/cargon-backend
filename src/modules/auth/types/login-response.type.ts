import { User } from '@prisma/client';

export type LoginResponse = {
  user: User;
  accessToken: string;
  expiresIn: number;
};
