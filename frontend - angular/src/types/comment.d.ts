import { User } from './user';

export type Comment = {
  date: string;
  content: string;
  userDto: User;
};
